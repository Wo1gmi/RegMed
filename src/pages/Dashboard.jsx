import React from 'react'
import { dossiers, activityFeed, criticalIssues } from '../data/mockData.js'

function KPICard({ icon, label, value, trend, trendUp, color }) {
  return (
    <div style={{
      background: '#1E293B',
      border: '1px solid #334155',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'border-color 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#475569'}
    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#334155'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: `${color}1A`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
        }}>
          {icon}
        </div>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          fontSize: '12px',
          color: trendUp ? '#22C55E' : '#EF4444',
          fontWeight: '500',
        }}>
          {trendUp ? '↑' : '↓'} {trend}
        </span>
      </div>
      <div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: '#F1F5F9', lineHeight: '1' }}>{value}</div>
        <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>{label}</div>
      </div>
    </div>
  )
}

function ActivityIcon({ type, color }) {
  const icons = {
    audit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    upload: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    comment: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    alert: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="10.29 3.86 1.82 18 22.18 18 13.71 3.86 10.29 3.86"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    info: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  }
  return (
    <div style={{
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      background: `${color}1A`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: color,
      flexShrink: 0,
    }}>
      {icons[type]}
    </div>
  )
}

export default function Dashboard({ setCurrentPage }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>}
          label="Активных досье"
          value="12"
          trend="vs прошлый мес."
          trendUp={true}
          color="#9966FF"
        />
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="10.29 3.86 1.82 18 22.18 18 13.71 3.86 10.29 3.86"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
          label="Выявленных рисков"
          value="7"
          trend="3 новых"
          trendUp={false}
          color="#EF4444"
        />
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          label="Ср. срок до РУ"
          value="4.2 мес"
          trend="0.3 мес"
          trendUp={true}
          color="#EAB308"
        />
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>}
          label="Экономия времени"
          value="63%"
          trend="8% за квартал"
          trendUp={true}
          color="#22C55E"
        />
      </div>

      {/* Two columns: Activity + Critical Issues */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '16px' }}>
        {/* Activity Feed */}
        <div style={{
          background: '#1E293B',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#F1F5F9', margin: 0 }}>Лента активности</h3>
            <button style={{
              background: 'none',
              border: 'none',
              color: '#9966FF',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}>Все события →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {activityFeed.map((item) => (
              <div key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '10px 8px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#334155'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <ActivityIcon type={item.icon} color={item.color} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', color: '#E2E8F0', fontWeight: '500' }}>{item.message}</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{item.detail}</div>
                </div>
                <span style={{ fontSize: '11px', color: '#475569', whiteSpace: 'nowrap', flexShrink: 0 }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Issues */}
        <div style={{
          background: '#1E293B',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#F1F5F9', margin: 0 }}>Критические проблемы</h3>
            <span style={{
              background: '#EF44441A',
              color: '#EF4444',
              borderRadius: '10px',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: '600',
            }}>
              {criticalIssues.filter(i => i.severity === 'critical').length} критичных
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {criticalIssues.map((issue) => (
              <div key={issue.id} style={{
                background: issue.severity === 'critical' ? '#EF44441A' : '#EAB3081A',
                border: `1px solid ${issue.severity === 'critical' ? '#EF444430' : '#EAB30830'}`,
                borderRadius: '10px',
                padding: '12px',
                cursor: 'pointer',
              }}
              onClick={() => setCurrentPage('audit')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#CBD5E1' }}>{issue.dossier}</span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: issue.severity === 'critical' ? '#EF4444' : '#EAB308',
                    background: issue.severity === 'critical' ? '#EF444420' : '#EAB30820',
                    borderRadius: '4px',
                    padding: '2px 6px',
                  }}>
                    {issue.severity === 'critical' ? 'КРИТИЧНО' : 'ВАЖНО'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '8px', lineHeight: '1.4' }}>{issue.issue}</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  Дедлайн: {new Date(issue.deadline).toLocaleDateString('ru-RU')}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div style={{
            marginTop: 'auto',
            paddingTop: '16px',
            borderTop: '1px solid #334155',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
          }}>
            {[
              { label: 'В работе', count: 8, color: '#9966FF' },
              { label: 'Замечания', count: 3, color: '#EAB308' },
              { label: 'Готово', count: 1, color: '#22C55E' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: s.color }}>{s.count}</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Dossiers mini-table */}
      <div style={{
        background: '#1E293B',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#F1F5F9', margin: 0 }}>Последние досье</h3>
          <button
            onClick={() => setCurrentPage('dossiers')}
            style={{
              background: 'none',
              border: 'none',
              color: '#9966FF',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >Все досье →</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                {['Наименование', 'Тип', 'Класс риска', 'Прогресс', 'Статус', 'Обновлено'].map((col) => (
                  <th key={col} style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    color: '#64748B',
                    fontWeight: '500',
                    fontSize: '12px',
                    borderBottom: '1px solid #334155',
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dossiers.slice(0, 4).map((d) => (
                <tr key={d.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#334155'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 12px', color: '#E2E8F0', fontWeight: '500' }}>{d.name}</td>
                  <td style={{ padding: '10px 12px', color: '#94A3B8' }}>{d.type}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      background: d.riskClass === '3' ? '#EF44441A' : d.riskClass === '2б' ? '#EAB3081A' : '#22C55E1A',
                      color: d.riskClass === '3' ? '#EF4444' : d.riskClass === '2б' ? '#EAB308' : '#22C55E',
                      borderRadius: '6px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      fontWeight: '600',
                    }}>Класс {d.riskClass}</span>
                  </td>
                  <td style={{ padding: '10px 12px', minWidth: '120px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '5px', background: '#334155', borderRadius: '3px' }}>
                        <div style={{ width: `${d.progress}%`, height: '100%', background: '#9966FF', borderRadius: '3px' }}/>
                      </div>
                      <span style={{ fontSize: '11px', color: '#94A3B8', minWidth: '30px' }}>{d.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <StatusBadge status={d.status} />
                  </td>
                  <td style={{ padding: '10px 12px', color: '#64748B' }}>
                    {new Date(d.updatedAt).toLocaleDateString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const cfg = {
    'Аудит': { bg: '#9966FF1A', color: '#9966FF' },
    'Подготовка': { bg: '#94A3B81A', color: '#94A3B8' },
    'Готово': { bg: '#22C55E1A', color: '#22C55E' },
    'На проверке': { bg: '#EAB3081A', color: '#EAB308' },
    'Замечания': { bg: '#EF44441A', color: '#EF4444' },
  }
  const c = cfg[status] || { bg: '#94A3B81A', color: '#94A3B8' }
  return (
    <span style={{
      background: c.bg,
      color: c.color,
      borderRadius: '6px',
      padding: '2px 8px',
      fontSize: '11px',
      fontWeight: '600',
    }}>{status}</span>
  )
}
