import {
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxJsonSchema,
  toTypedRxJsonSchema,
} from "rxdb"

const videoEventSchemaLiteral = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    videoId: {
      type: "string",
    },
    title: {
      type: "string",
    },
    channelName: {
      type: "string",
    },
    channelUrl: {
      type: "string",
    },
    description: {
      type: "string",
    },
    startTime: {
      type: "string",
      format: "date-time",
    },
    endTime: {
      type: "string",
      format: "date-time",
    },
    uploaded: {
      type: "boolean",
    },
    category: {
      type: "string",
    },
    categoryType: {
      type: "string",
      enum: ["positive", "negative", "neutral"]
    },
  },
  required: [
    "id",
    "videoId",
    "title",
    "channelName",
    "channelUrl",
    "description",
    "startTime",
    "endTime",
  ],
} as const

const schemaTyped = toTypedRxJsonSchema(videoEventSchemaLiteral)

// aggregate the document type from the schema
export type VideoEventDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>

// create the typed RxJsonSchema from the literal typed object.
export const videoEventSchema: RxJsonSchema<VideoEventDocType> = videoEventSchemaLiteral
