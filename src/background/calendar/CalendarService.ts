import { Signal, effect } from "@preact/signals-react"
import { MyDatabase } from "../database"
import dayjs from "dayjs"
import { EventInfo, addEventToGoogleCalendar } from "@/shared/calendar/addEventToGoogleCalendar"
import { VideoEventDocType } from "../database/collections/VideoEvent/schema"
import { CurrentlyPlayedVideoType } from "@/shared/state/video/currentlyPlayedVideos"
import type { RxDocument } from 'rxdb'
import { CategoryService, CategoryServiceConfig, CategoryType } from "./CategoryService"

type VideoEventDocument = RxDocument<VideoEventDocType>

export class CalendarService {
  private readonly ALARM_NAME = "CALENDAR_SYNC_ALARM"
  private readonly categoryService: CategoryService

  constructor(
    private readonly database: MyDatabase | null,
    private readonly config: {
      activityRetentionPeriodSignal: Signal<number>
      videoResumeThresholdSignal: Signal<number>
      minVideoWatchDurationSignal: Signal<number>
      calendarEventPrefixSignal: Signal<string>
      calendarIdSignal: Signal<string | null>
      providerTokenSignal: Signal<string | null>
      calendarSyncFrequencySignal: Signal<number>
      currentlyPlayedVideosSignal: Signal<CurrentlyPlayedVideoType[]>
      categoryConfig: CategoryServiceConfig
    }
  ) {
    this.categoryService = new CategoryService(config.categoryConfig)
  }

  public initialize(): void {
    chrome.alarms.onAlarm.addListener(this.handleAlarm)
    this.setupSyncFrequency()
    console.log("CalendarService initialized")
  }

  private setupSyncFrequency(): void {
    // Signal effect runs on creation and whenever the signal value changes
    effect(() => {
      const periodInMinutes = this.config.calendarSyncFrequencySignal.value / 60
      this.createAlarm(periodInMinutes)
      return () => chrome.alarms.clear(this.ALARM_NAME)
    })
  }

  private async createAlarm(periodInMinutes: number): Promise<void> {
    const existingAlarm = await chrome.alarms.get(this.ALARM_NAME)
    if (existingAlarm) return

    chrome.alarms.create(this.ALARM_NAME, {
      delayInMinutes: 0.5,
      periodInMinutes,
    })
  }

  private handleAlarm = async (alarm: chrome.alarms.Alarm): Promise<void> => {
    if (alarm.name !== this.ALARM_NAME) return
    await this.flushEvents()
  }

  private async flushEvents(): Promise<void> {
    if (!this.database) {
      throw new Error("Database not initialized")
    }

    const { calendarIdSignal, providerTokenSignal } = this.config
    
    if (!calendarIdSignal.value) {
      throw new Error("Calendar ID not set")
    }
    if (!providerTokenSignal.value) {
      throw new Error("Provider token not set")
    }

    const events = await this.queryEventsInBounds()
    const longEnoughEvents = this.filterEventsByDuration(events)
    await this.uploadEvents(longEnoughEvents)
  }

  private async queryEventsInBounds(): Promise<VideoEventDocument[]> {
    if (!this.database) {
      throw new Error("Database not initialized")
    }

    const queryStartTime = dayjs()
      .subtract(this.config.activityRetentionPeriodSignal.value, "second")
      .toISOString()

    const queryEndTime = dayjs()
      .subtract(this.config.videoResumeThresholdSignal.value, "second")
      .toISOString()

    return await this.database.videos_events
      .find({
        selector: {
          startTime: { $gte: queryStartTime },
          endTime: { $lte: queryEndTime },
          uploaded: { $ne: true },
        },
      })
      .exec()
  }

  private filterEventsByDuration(events: VideoEventDocument[]): VideoEventDocument[] {
    return events.filter((event) => {
      const started = dayjs(event.startTime)
      const ended = dayjs(event.endTime)
      const lasted = ended.diff(started, "seconds")
      return lasted >= this.config.minVideoWatchDurationSignal.value
    })
  }

  private async uploadEvents(events: VideoEventDocument[]): Promise<void> {
    for (const event of events) {
      // Categorize video if not already categorized
      if (!event.category) {
        const videoInfo = {
          title: event.title,
          channelName: event.channelName,
          channelUrl: event.channelUrl,
          videoId: event.videoId,
          description: event.description
        }
        
        const category = await this.categoryService.categorizeVideo(videoInfo)
        if (category) {
          await event.patch({
            category: category.name,
            categoryType: category.type
          })
        }
      }

      const eventInfo = this.prepareEventInfo(event)
      const added = await addEventToGoogleCalendar(
        this.config.calendarIdSignal.value!,
        eventInfo,
        this.config.providerTokenSignal.value!
      )

      if (added) {
        await this.markEventAsUploaded(event)
      }
    }
  }

  private getCategoryEmoji(categoryType: CategoryType): string {
    switch (categoryType) {
      case 'positive':
        return '✅'
      case 'negative':
        return '⚠️'
      case 'neutral':
        return '➖'
    }
  }

  private getCategoryInfluenceText(categoryType: CategoryType): string {
    switch (categoryType) {
      case 'positive':
        return 'Positive Activity'
      case 'negative':
        return 'Negative Activity'
      case 'neutral':
        return 'Neutral Activity'
    }
  }

  private prepareEventInfo(event: VideoEventDocument): EventInfo {
    const categoryInfo = event.category && event.categoryType
      ? `\nCategory: ${event.category} (${this.getCategoryEmoji(event.categoryType)} ${this.getCategoryInfluenceText(event.categoryType)})`
      : ''
    
    const summaryEmoji = event.categoryType ? `${this.getCategoryEmoji(event.categoryType)} ` : ''
    
    return {
      summary: `${this.config.calendarEventPrefixSignal.value} ${summaryEmoji}${event.title}`,
      description: `https://www.youtube.com/watch?v=${event.videoId}\nChannel: ${event.channelName}${categoryInfo}`,
      startTime: event.startTime,
      endTime: event.endTime,
    }
  }

  private async markEventAsUploaded(event: VideoEventDocument): Promise<void> {
    await event.patch({ uploaded: true })
    
    this.config.currentlyPlayedVideosSignal.value = 
      this.config.currentlyPlayedVideosSignal.value.map(video => 
        video.id === event.id ? { ...video, uploaded: true } : video
      )
  }

} 