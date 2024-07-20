import { currentlyPlayedVideosSignal } from "@/shared/state/video/currentlyPlayedVideos"
import { useSignals } from "@preact/signals-react/runtime"

export default function () {
  useSignals()
  return (
    <>
      {currentlyPlayedVideosSignal.value.map((video) => (
        <div key={video.id}>
          {video.title} - {video.startTime} - {video.endTime}
        </div>
      ))}
    </>
  )
}
