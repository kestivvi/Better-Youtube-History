console.info('contentScript is running')

import type { VideoInfo } from '../background/runtime_messages/types'

///////////////////////////
// State

let currentVideoElement: HTMLVideoElement | null = null
const VideoBlobSrcVideoInfoMap: Map<string, VideoInfo> = new Map()

///////////////////////////
// Pure Functions

const addEventsListenersToVideo = (video: HTMLVideoElement) => {
  console.log('Adding events listeners to video')
  video.addEventListener('timeupdate', (ev) => {
    const videoInfo = checkVideoInfo()
    if (videoInfo === null) return

    chrome.runtime.sendMessage({
      type: 'VIDEO_PLAYING',
      data: {
        timestamp: new Date().toISOString(),
        videoInfo,
      },
    })
  })
}

///////////////////////////
// Stateful Functions

const checkVideoInfo = (): VideoInfo | null => {
  let newVideoBlobId =
    currentVideoElement !== null
      ? currentVideoElement.src.replace('blob:https://www.youtube.com/', '')
      : null
  if (newVideoBlobId === null) {
    console.log('newVideoBlobId is null')
    return null
  }

  let newVideoId =
    document.querySelector('#page-manager > ytd-watch-flexy')?.getAttribute('video-id') ?? null

  let newTitle = document.querySelector('#title > h1 > yt-formatted-string')?.textContent ?? null

  let newChannel = document.querySelector('#text > a')?.textContent ?? null

  const channelLinkElement: HTMLAnchorElement | null = document.querySelector('#text > a')
  let newChannelUrl = channelLinkElement?.href ?? null

  let newVideoInfo: VideoInfo | null = null

  if (newVideoId === null || newTitle === null || newChannel === null || newChannelUrl === null) {
    console.log('newTitle, newChannel or newChannelUrl is null')
    console.log('Trying to get info from map')

    newVideoInfo = VideoBlobSrcVideoInfoMap.get(newVideoBlobId) ?? null

    if (newVideoInfo === null) {
      console.log('videoInfo not found in the map')
      return null
    }

    return newVideoInfo
  } else {
    newVideoInfo = {
      videoId: newVideoId,
      videoBlobId: newVideoBlobId,
      title: newTitle,
      channel: newChannel,
      channelUrl: newChannelUrl,
    }

    let oldVideoInfo = VideoBlobSrcVideoInfoMap.get(newVideoBlobId) ?? null

    if (
      oldVideoInfo === null ||
      oldVideoInfo.videoId !== newVideoId ||
      oldVideoInfo.title !== newTitle ||
      oldVideoInfo.channel !== newChannel ||
      oldVideoInfo.channelUrl !== newChannelUrl
    ) {
      console.log('Updating video info in the map')
      console.log('Old video info: ', oldVideoInfo)
      console.log('New video info: ', newVideoInfo)
      VideoBlobSrcVideoInfoMap.set(newVideoBlobId, newVideoInfo)
    }

    return newVideoInfo
  }
}

const checkVideoElement = () => {
  console.log('Checking video element')

  // Handle video element changes
  // TODO: What if there are more than one video elements?
  const newVideoElement = document.getElementsByTagName('video')?.[0] ?? null

  console.log('newVideoElement: ', newVideoElement)

  if (newVideoElement === null) return
  if (newVideoElement === currentVideoElement) return

  if (currentVideoElement) {
    currentVideoElement.removeEventListener('timeupdate', () => {})
  }

  currentVideoElement = newVideoElement

  addEventsListenersToVideo(currentVideoElement)
}

///////////////////////////
// Set Intervals

setInterval(checkVideoElement, 5000)
