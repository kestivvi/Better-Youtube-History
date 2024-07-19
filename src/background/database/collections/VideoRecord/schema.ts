import {
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxJsonSchema,
  toTypedRxJsonSchema,
} from "rxdb"

export const videoRecordSchemaLiteral = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    type: {
      type: "string",
    },
    videoId: {
      type: "string",
    },
    title: {
      type: "string",
    },
    channel: {
      type: "string",
    },
    channelUrl: {
      type: "string",
    },
    timestamp: {
      type: "string",
      format: "date-time",
    },
  },
  required: ["id", "type", "videoId", "timestamp"],
} as const

const schemaTyped = toTypedRxJsonSchema(videoRecordSchemaLiteral)

// aggregate the document type from the schema
export type VideoRecordDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>

// create the typed RxJsonSchema from the literal typed object.
export const videoRecordSchema: RxJsonSchema<VideoRecordDocType> =
  videoRecordSchemaLiteral
