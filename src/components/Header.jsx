import React, { useState } from 'react'

const pageTitles = {
  dashboard: 'Дашборд',
  dossiers: 'Мои досье',
  'new-dossier': 'Новое досье',
  audit: 'Аудит досье',
  lifecycle: 'Жизненный цикл',
  compliance: 'Комплаенс & прогнозы',
  integrations: 'Интеграции',
}

export default function Header({ currentPage }) {
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header style={{
      height: '64px',
      background: '#0F172A',
      borderBottom: '1px solid #1E293B',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'fixed',
      top: 0,
      left: '260px',
      right: 0,
      zIndex: 99,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#F1F5F9', margin: 0 }}>
            {pageTitles[currentPage] || 'RegMed'}
          </h1>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            {new Date().toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Поиск досье..."
            style={{
              background: '#1E293B',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '7px 12px 7px 36px',
              fontSize: '13px',
              color: '#F1F5F9',
              outline: 'none',
              width: '220px',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => e.target.style.borderColor = '#9966FF'}
            onBlur={(e) => e.target.style.borderColor = '#334155'}
          />
          <svg
            width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"
            style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>

        {/* Refresh */}
        <button
          style={{
            background: '#1E293B',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '7px',
            cursor: 'pointer',
            color: '#94A3B8',
            display: 'flex',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#334155'; e.currentTarget.style.color = '#F1F5F9' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.color = '#94A3B8' }}
          title="Обновить данные"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            style={{
              background: '#1E293B',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '7px',
              cursor: 'pointer',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#334155'; e.currentTarget.style.color = '#F1F5F9' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.color = '#94A3B8' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              background: '#EF4444',
              borderRadius: '50%',
              border: '1px solid #0F172A',
            }}/>
          </button>
          {notifOpen && (
            <div style={{
              position: 'absolute',
              top: '44px',
              right: 0,
              background: '#1E293B',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '12px',
              width: '300px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              zIndex: 999,
            }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9', marginBottom: '10px', padding: '0 4px' }}>Уведомления</div>
              {[
                { text: 'Дедлайн через 5 дней: Кардиомонитор CM-100', time: '10 мин', color: '#EAB308' },
                { text: 'Критическое замечание в ИИ-система диагностики', time: '1 ч', color: '#EF4444' },
                { text: 'Обновление нормативной базы: ГОСТ Р ИСО 14971', time: '2 ч', color: '#9966FF' },
              ].map((n, i) => (
                <div key={i} style={{
                  padding: '8px',
                  borderRadius: '8px',
                  marginBottom: '4px',
                  cursor: 'pointer',
                  background: 'transparent',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#334155'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: n.color, marginTop: '5px', flexShrink: 0 }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: '1.4' }}>{n.text}</div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{n.time} назад</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', background: '#334155', margin: '0 4px' }}/>

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #9966FF, #8B5CF6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: '700',
            color: 'white',
          }}>
            АИ
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#F1F5F9' }}>Анна Иванова</div>
          </div>
        </div>
      </div>
    </header>
  )
}
