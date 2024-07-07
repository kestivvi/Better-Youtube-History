import { type RxDatabase, addRxPlugin } from 'rxdb'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { createRxDatabase } from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { type MyDatabaseCollections } from './collections'
import { videoEventSchema } from './collections/VideoEvent/schema'
import { videoRecordSchema } from './collections/VideoRecord/schema'

export type MyDatabase = RxDatabase<MyDatabaseCollections>

// @ts-expect-error
const isDev = process.env.NODE_ENV == 'development'
if (isDev) {
  addRxPlugin(RxDBDevModePlugin)
}

export const setupDatabase = async (): Promise<MyDatabase> => {
  // await removeRxDatabase('mydatabase', getRxStorageDexie())

  const myDatabase: MyDatabase = await createRxDatabase<MyDatabaseCollections>({
    name: 'mydatabase',
    storage: getRxStorageDexie(),
    multiInstance: true,
    ignoreDuplicate: true,
  })

  await myDatabase.addCollections({
    videos_records: {
      schema: videoRecordSchema,
    },
    videos_events: {
      schema: videoEventSchema,
    },
  })

  // myDatabase.videos_events.remove()
  // myDatabase.videos_records.remove()

  return myDatabase
}

let database: MyDatabase | null = null

;(async () => {
  database = await setupDatabase()
})()

export { database }
