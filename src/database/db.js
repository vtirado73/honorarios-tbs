import Dexie from 'dexie'

const db = new Dexie('lecturerFees')

db.version(1).stores({
  docentes: 'id, name, ci, email, active, created_at',
})

db.version(2).stores({
  carreras: 'id, name, active, created_at',
})

db.version(4).stores({
  carreras: 'id, &acronym, name, active, created_at',
})

db.version(3).stores({
  asignaturas: 'id, &acronym, name, career_id, active, created_at',
})

db.version(5).stores({
  periodos: 'id, name, start_at, end_at, active, created_at',
})

db.version(6).stores({
  settings: 'id, pay_per_hour, created_at, updated_at',
})

db.version(7).stores({
  settings: 'id, pay_per_hour, morning_start, morning_end, afternoon_start, afternoon_end, evening_start, evening_end, created_at, updated_at',
})

db.version(8).stores({
  schedules: 'id, professor_id, subject_id, period_id, day, shift, active, created_at',
})

db.version(9).stores({
  holidays: 'id, title, date, active, created_at',
})

db.version(10).stores({
  users: 'id, user',
})

db.version(11).stores({
  asignaturas: 'id, &acronym, name, career_id, nivel, active, created_at',
})

export default db
