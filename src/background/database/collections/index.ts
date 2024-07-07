import { type VideoEventCollection } from "./VideoEvent";
import { type VideoRecordCollection } from "./VideoRecord";

export type MyDatabaseCollections = {
  videos_records: VideoRecordCollection;
  videos_events: VideoEventCollection;
};
