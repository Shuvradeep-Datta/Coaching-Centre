export const CLASSES = ['5', '6', '7', '8', '9', '10']

export function uid() {
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
}

// "YYYY-MM" for the current month
export function currentMonth(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

// "YYYY-MM-DD" for the given (or current) date
export function isoDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// "YYYY-MM" -> "August 2026"
export function monthLabel(month) {
  const [y, m] = month.split('-').map(Number)
  const date = new Date(y, m - 1, 1)
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
}

export function rupee(n) {
  const num = Number(n) || 0
  return '₹' + num.toLocaleString('en-IN')
}

export function feeKey(studentId, month) {
  return `${studentId}:${month}`
}

// Normalise a phone number to countryCode + local number.
// A bare 10-digit number gets the country code prefixed automatically.
export function fullPhone(phone, countryCode) {
  const digits = String(phone || '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.length === 10) return `${countryCode}${digits}`
  return digits
}

// Banglish reminder message template.
export function reminderMessage({ guardian, student, className, roll, month, amount, schoolName }) {
  return `Dear ${guardian}, ${student.split(" ")[0]}  hasn't yet paid    ${monthLabel(month)} tution fee  (₹${amount}). Please try to pay it soon. Thank you 😊  — ${schoolName}.`
}

export function whatsappUrl(fullNumber, message) {
  return `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`
}

export function smsUrl(fullNumber, message) {
  return `sms:${fullNumber}?body=${encodeURIComponent(message)}`
}

// Next global Sl No. = highest existing numeric roll + 1, so deleting a
// student never lets an old number be reused (avoids duplicates). Starts at 1.
export function nextSerial(students) {
  const max = students.reduce((m, s) => {
    const n = Number(s.roll)
    return !isNaN(n) && n > m ? n : m
  }, 0)
  return max + 1
}

// Sort students by class (numeric) then roll (numeric-aware).
export function sortStudents(list) {
  return [...list].sort((a, b) => {
    const c = Number(a.className) - Number(b.className)
    if (c !== 0) return c
    const ra = Number(a.roll), rb = Number(b.roll)
    if (!isNaN(ra) && !isNaN(rb) && ra !== rb) return ra - rb
    return String(a.roll).localeCompare(String(b.roll))
  })
}

// Collect every "YYYY-MM" that has at least one fee record, newest first.
export function feeMonths(fees) {
  const set = new Set()
  Object.keys(fees).forEach((k) => {
    const month = k.split(':')[1]
    if (month) set.add(month)
  })
  return [...set].sort().reverse()
}

function csvCell(value) {
  const s = String(value ?? '')
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
  return s
}

// Build a CSV (with UTF-8 BOM) containing the student list + all fee records.
export function buildCsv({ students, fees }) {
  const rows = []
  rows.push(['Type', 'Student ID', 'Name', 'Roll', 'Class', 'Guardian', 'Phone', 'Month', 'Amount', 'Paid'])

  const sorted = sortStudents(students)
  sorted.forEach((s) => {
    rows.push(['Student', s.id, s.name, s.roll, s.className, s.guardianName, s.phone, '', '', ''])
  })

  const byStudent = {}
  sorted.forEach((s) => { byStudent[s.id] = s })
  Object.keys(fees).sort().forEach((key) => {
    const [studentId, month] = key.split(':')
    const s = byStudent[studentId]
    if (!s) return
    const rec = fees[key]
    rows.push(['Fee', s.id, s.name, s.roll, s.className, s.guardianName, s.phone, month, rec.amount, rec.paid ? 'Paid' : 'Unpaid'])
  })

  const body = rows.map((r) => r.map(csvCell).join(',')).join('\r\n')
  return '﻿' + body // UTF-8 BOM so Excel shows Bengali / ₹ correctly
}

export function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
