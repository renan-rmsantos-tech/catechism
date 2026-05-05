import Dexie, { type Table } from 'dexie'
import type { PendingSession } from './attendance/schemas'

class CatechismDB extends Dexie {
  pending_sessions!: Table<PendingSession, string>

  constructor() {
    super('catechism')
    this.version(1).stores({
      pending_sessions: 'id, classId, date, catechistId, createdAt',
    })
  }
}

export const db = new CatechismDB()
