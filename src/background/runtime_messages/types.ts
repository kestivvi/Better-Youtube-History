////////////////////////////////////////////////////////////////////
// Runtime General Message

import type { VideoEventDocType } from "../database/collections/VideoEvent/schema"

export type MessageType = "OPEN_IN_TAB" | "VIDEO_PLAYING"

interface GeneralMessage<T extends MessageType> {
  type: T
  data?: any
}

////////////////////////////////////////////////////////////////////
// Runtime Specific Messages

// Video Playing Message

export interface VideoPlayingMessage extends GeneralMessage<"VIDEO_PLAYING"> {
  data: {
    videoInfo: VideoInfo
    timestamp: string
  }
}

export type VideoInfo = Pick<
  VideoEventDocType,
  "channelName" | "channelUrl" | "title" | "videoId"
>

////////////////////////////////////////////////////////////////////
// Final Message Type

export type Message = VideoPlayingMessage

const dummyOnMessageListener = <MessageType>(
  _message: MessageType,
  _sender: chrome.runtime.MessageSender,
  _sendResponse: (response?: any) => void,
): void => {}

export type OnMessageListener<MessageType> = typeof dummyOnMessageListener<MessageType>
