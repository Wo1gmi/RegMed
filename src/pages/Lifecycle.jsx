import React, { useState } from 'react'
import { lifecycleStages, calendarEvents } from '../data/mockData.js'

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1
  const days = []
  for (let i = 0; i < startOffset; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)
  return days
}

function getEventsForDay(year, month, day, events) {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return events.filter(e => e.date === dateStr)
}

export default function Lifecycle() {
  const [currentMonth, setCurrentMonth] = useState(6) // July (0-indexed)
  const [currentYear] = useState(2026)
  const [selectedDay, setSelectedDay] = useState(null)
  const [stageStatuses, setStageStatuses] = useState({
    1: 'completed',
    2: 'completed',
    3: 'current',
    4: 'pending',
    5: 'pending',
  })

  const days = getCalendarDays(currentYear, currentMonth)
  const today = new Date()
  const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() === currentMonth

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
  ]

  const selectedDayEvents = selectedDay
    ? getEventsForDay(currentYear, currentMonth, selectedDay, calendarEvents)
    : []

  const allUpcoming = calendarEvents
    .filter(e => e.date >= '2026-07-01')
    .sort((a, b) => a.date.localeCompare(b.date))

  const getStageStyle = (status) => {
    if (status === 'completed') return { bg: '#22C55E', border: '#22C55E', text: 'white' }
    if (status === 'current') return { bg: '#9966FF', border: '#9966FF', text: 'white' }
    return { bg: '#1E293B', border: '#334155', text: '#64748B' }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Stage diagram */}
      <div style={{
        background: '#1E293B',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '28px 24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#F1F5F9', margin: 0 }}>Этапы регистрации</h3>
          <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
            {[
              { label: 'Завершено', color: '#22C55E' },
              { label: 'В процессе', color: '#9966FF' },
              { label: 'Ожидает', color: '#334155' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: l.color }}/>
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* Stage line */}
        <div style={{ position: 'relative', padding: '0 20px' }}>
          {/* Connector line */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '60px',
            right: '60px',
            height: '2px',
            background: '#334155',
          }}>
            <div style={{
              width: '40%',
              height: '100%',
              background: 'linear-gradient(90deg, #22C55E, #9966FF)',
            }}/>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            {lifecycleStages.map((stage, i) => {
              const s = getStageStyle(stageStatuses[stage.id])
              return (
                <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: s.bg,
                    border: `2px solid ${s.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: s.text,
                    fontWeight: '700',
                    fontSize: '14px',
                    boxShadow: stage.status === 'current' ? '0 0 0 6px rgba(6,182,212,0.15)' : 'none',
                    transition: 'all 0.3s',
                  }}>
                    {stageStatuses[stage.id] === 'completed' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : stage.id}
                  </div>
                  <div style={{ textAlign: 'center', maxWidth: '110px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: stageStatuses[stage.id] === 'pending' ? '#64748B' : '#E2E8F0', marginBottom: '4px', lineHeight: '1.3' }}>
                      {stage.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>
                      {stage.completedDate
                        ? `✓ ${new Date(stage.completedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`
                        : stage.expectedDate
                        ? `→ ${new Date(stage.expectedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`
                        : ''}
                    </div>
                  </div>
                  {/* Action buttons per stage */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {stageStatuses[stage.id] !== 'completed' && stageStatuses[stage.id] !== 'pending' && (
                      <button
                        onClick={() => setStageStatuses(s => ({ ...s, [stage.id]: 'completed', [stage.id + 1]: stage.id < 5 ? 'current' : 'pending' }))}
                        style={{
                          background: '#22C55E1A',
                          border: '1px solid #22C55E30',
                          color: '#22C55E',
                          borderRadius: '5px',
                          padding: '3px 8px',
                          fontSize: '10px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}>Завершить</button>
                    )}
                    <button
                      style={{
                        background: '#0F172A',
                        border: '1px solid #334155',
                        color: '#64748B',
                        borderRadius: '5px',
                        padding: '3px 6px',
                        fontSize: '10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Загрузить
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Calendar + Events */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px' }}>
        {/* Calendar */}
        <div style={{
          background: '#1E293B',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button
              onClick={() => setCurrentMonth(m => m > 0 ? m - 1 : 11)}
              style={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#94A3B8' }}
            >
              ←
            </button>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#F1F5F9', margin: 0 }}>
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <button
              onClick={() => setCurrentMonth(m => m < 11 ? m + 1 : 0)}
              style={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#94A3B8' }}
            >
              →
            </button>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '11px', color: '#64748B', fontWeight: '600', padding: '4px' }}>{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {days.map((day, i) => {
              if (!day) return <div key={i}/>
              const events = getEventsForDay(currentYear, currentMonth, day, calendarEvents)
              const isToday = isCurrentMonth && day === today.getDate()
              const isSelected = selectedDay === day

              return (
                <div
                  key={i}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  style={{
                    minHeight: '52px',
                    padding: '4px',
                    borderRadius: '6px',
                    cursor: events.length > 0 || isToday ? 'pointer' : 'default',
                    background: isSelected ? '#2D1B69' : isToday ? '#2D1B69' : 'transparent',
                    border: isSelected ? '1px solid #9966FF' : isToday ? '1px solid #7B44EE' : '1px solid transparent',
                    transition: 'background 0.15s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                  onMouseEnter={(e) => { if (!isSelected && !isToday) e.currentTarget.style.background = '#334155' }}
                  onMouseLeave={(e) => { if (!isSelected && !isToday) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{
                    fontSize: '12px',
                    fontWeight: isToday ? '700' : '400',
                    color: isToday ? '#9966FF' : isSelected ? '#9966FF' : '#CBD5E1',
                  }}>{day}</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', justifyContent: 'center' }}>
                    {events.map((ev, j) => (
                      <div key={j} style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: ev.color,
                      }}/>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {selectedDayEvents.length > 0 && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #334155' }}>
              <h4 style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '8px' }}>
                {selectedDay} {monthNames[currentMonth]}
              </h4>
              {selectedDayEvents.map((ev, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  padding: '6px 0',
                  borderBottom: i < selectedDayEvents.length - 1 ? '1px solid #334155' : 'none',
                }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: ev.color, flexShrink: 0 }}/>
                  <span style={{ fontSize: '12px', color: '#E2E8F0' }}>{ev.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming events */}
        <div style={{
          background: '#1E293B',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '20px',
          overflowY: 'auto',
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#F1F5F9', margin: '0 0 16px' }}>
            Предстоящие события
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {allUpcoming.map((ev, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '12px',
                padding: '10px',
                background: '#0F172A',
                border: '1px solid #334155',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = ev.color}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#334155'}
              >
                <div style={{
                  width: '4px',
                  background: ev.color,
                  borderRadius: '2px',
                  flexShrink: 0,
                }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#E2E8F0', fontWeight: '500', marginBottom: '3px', lineHeight: '1.4' }}>
                    {ev.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    {new Date(ev.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                  </div>
                </div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: ev.color,
                  background: `${ev.color}1A`,
                  borderRadius: '4px',
                  padding: '2px 6px',
                  height: 'fit-content',
                  whiteSpace: 'nowrap',
                }}>
                  {ev.type === 'deadline' ? 'Дедлайн' :
                   ev.type === 'submission' ? 'Подача' :
                   ev.type === 'critical' ? 'Критично' :
                   ev.type === 'review' ? 'Экспертиза' :
                   ev.type === 'approval' ? 'РУ' : 'Аудит'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
