import { CategoryService } from "@/background/calendar/CategoryService"
import {
  categoriesSignal,
  llmApiKeySignal,
  llmApiUrlSignal,
} from "@/shared/state/calendar/categoryConfig"
import { currentlyPlayedVideosSignal } from "@/shared/state/video/currentlyPlayedVideos"
import { Badge, Button, Card, Group, Stack, Text } from "@mantine/core"
import { useSignals } from "@preact/signals-react/runtime"

const categoryService = new CategoryService({
  categoriesSignal,
  llmApiUrlSignal,
  apiKeySignal: llmApiKeySignal,
})

export default function () {
  useSignals()

  const handleCategorize = async (
    video: (typeof currentlyPlayedVideosSignal.value)[0],
  ) => {
    const videoInfo = {
      title: video.title,
      channelName: video.channelName,
      description: video.description,
      videoId: video.id,
      channelUrl: video.channelUrl || "",
    }

    const category = await categoryService.categorizeVideo(videoInfo)
    if (category) {
      currentlyPlayedVideosSignal.value = currentlyPlayedVideosSignal.value.map((v) =>
        v.id === video.id
          ? { ...v, category: category.name, categoryType: category.type }
          : v,
      )
    }
  }

  return (
    <Stack gap="md">
      {currentlyPlayedVideosSignal.value.map((video) => (
        <Card key={video.id} withBorder padding="sm">
          <Stack gap="xs">
            <Text fw={500} lineClamp={2}>
              {video.title}
            </Text>

            <Group gap="xs">
              <Text size="sm" c="dimmed">
                {new Date(video.startTime).toLocaleTimeString()} -{" "}
                {new Date(video.endTime).toLocaleTimeString()}
              </Text>

              <Badge
                variant="light"
                color={
                  video.categoryType === "positive"
                    ? "green"
                    : video.categoryType === "negative"
                      ? "red"
                      : "gray"
                }
              >
                {video.category ?? "No category"}
              </Badge>
            </Group>

            <Button
              size="xs"
              variant="light"
              onClick={() => handleCategorize(video)}
              disabled={!llmApiKeySignal.value || !llmApiUrlSignal.value}
            >
              Categorize
            </Button>
          </Stack>
        </Card>
      ))}
    </Stack>
  )
}
