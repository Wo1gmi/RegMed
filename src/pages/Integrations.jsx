import React, { useState } from 'react'
import { integrations } from '../data/mockData.js'

function StatusBadge({ status }) {
  const cfg = {
    connected: { bg: '#22C55E1A', color: '#22C55E', label: 'Подключено' },
    available: { bg: '#94A3B81A', color: '#94A3B8', label: 'Доступно' },
    premium: { bg: '#F974161A', color: '#F97416', label: 'Premium' },
  }
  const c = cfg[status]
  return (
    <span style={{ background: c.bg, color: c.color, borderRadius: '6px', padding: '3px 9px', fontSize: '11px', fontWeight: '600' }}>
      {c.label}
    </span>
  )
}

export default function Integrations() {
  const [connectingId, setConnectingId] = useState(null)
  const [connectedIds, setConnectedIds] = useState(new Set([1, 5]))
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)

  const handleConnect = (integration) => {
    if (integration.status === 'premium' || connectedIds.has(integration.id) && integration.id === 6) {
      setShowPremiumModal(true)
      return
    }
    if (connectedIds.has(integration.id)) {
      setConnectedIds(s => { const n = new Set(s); n.delete(integration.id); return n })
      return
    }
    setConnectingId(integration.id)
    setTimeout(() => {
      setConnectingId(null)
      setConnectedIds(s => new Set([...s, integration.id]))
    }, 1500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header info */}
      <div style={{
        background: '#2D1B6940',
        border: '1px solid #9966FF30',
        borderRadius: '10px',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9966FF" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div style={{ fontSize: '13px', color: '#94A3B8' }}>
          <span style={{ color: '#9966FF', fontWeight: '600' }}>
            {connectedIds.size} из {integrations.length} интеграций
          </span>
          {' '}подключено. Все данные передаются по зашифрованным каналам (TLS 1.3).
        </div>
      </div>

      {/* Integration cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {integrations.map(integration => {
          const isConnected = connectedIds.has(integration.id)
          const isConnecting = connectingId === integration.id
          const effectiveStatus = isConnected ? 'connected' : integration.status

          return (
            <div key={integration.id} style={{
              background: '#1E293B',
              border: `1px solid ${isConnected ? '#22C55E30' : '#334155'}`,
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              transition: 'all 0.2s',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = isConnected ? '#22C55E60' : '#475569' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = isConnected ? '#22C55E30' : '#334155' }}
            >
              {isConnected && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #22C55E, #9966FF)',
                }}/>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${integration.color}1A`,
                  border: `1px solid ${integration.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: integration.icon.length > 2 ? '11px' : '16px',
                  fontWeight: '800',
                  color: integration.color,
                  fontFamily: 'monospace',
                }}>
                  {integration.icon}
                </div>
                <StatusBadge status={effectiveStatus} />
              </div>

              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#F1F5F9', margin: '0 0 4px' }}>
                  {integration.name}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
                  {integration.description}
                </p>
              </div>

              {isConnected && (
                <div style={{
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '11px',
                  color: '#64748B',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Последняя синхр.</span>
                    <span style={{ color: '#22C55E' }}>5 мин назад</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span>Статус</span>
                    <span style={{ color: '#22C55E', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }}/>
                      Активно
                    </span>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleConnect(integration)}
                  disabled={isConnecting}
                  style={{
                    flex: 1,
                    background: isConnected ? 'transparent' : integration.status === 'premium' ? 'linear-gradient(135deg, #F97416, #EA580C)' : '#9966FF',
                    border: isConnected ? '1px solid #334155' : 'none',
                    color: isConnected ? '#94A3B8' : 'white',
                    borderRadius: '8px',
                    padding: '9px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: isConnecting ? 'wait' : 'pointer',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                  }}
                >
                  {isConnecting ? (
                    <>
                      <svg className="spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12"/>
                      </svg>
                      Подключение...
                    </>
                  ) : isConnected ? (
                    'Отключить'
                  ) : integration.status === 'premium' ? (
                    '⭐ Обновиться до Premium'
                  ) : (
                    'Подключить'
                  )}
                </button>
                {isConnected && (
                  <button style={{
                    background: '#0F172A',
                    border: '1px solid #334155',
                    color: '#94A3B8',
                    borderRadius: '8px',
                    padding: '9px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 1.83 12.24l-1.83-1.83M4.93 4.93a10 10 0 0 0-1.83 12.24l1.83-1.83M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                    </svg>
                    Настройки
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* API Key section */}
      <div style={{
        background: '#1E293B',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '20px',
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#F1F5F9', margin: '0 0 16px' }}>API доступ</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px', fontWeight: '500' }}>
              API-ключ (только для чтения)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey || 'rm_live_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}
                readOnly
                style={{
                  width: '100%',
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '9px 40px 9px 12px',
                  fontSize: '13px',
                  color: '#94A3B8',
                  outline: 'none',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box',
                }}
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '2px',
                }}
              >
                {showApiKey ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => navigator.clipboard?.writeText('rm_live_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')}
              style={{
                background: '#0F172A',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '9px 14px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#94A3B8',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Копировать
            </button>
            <button style={{
              background: '#EF44441A',
              border: '1px solid #EF444430',
              borderRadius: '8px',
              padding: '9px 14px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#EF4444',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}>Сбросить</button>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#475569', marginTop: '8px' }}>
          Документация API: <span style={{ color: '#9966FF', cursor: 'pointer' }}>docs.regmed.ru/api</span> · Лимит запросов: 1000/час (текущий тариф)
        </div>
      </div>

      {/* Premium modal */}
      {showPremiumModal && (
        <div className="modal-backdrop" onClick={() => setShowPremiumModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#F974161A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '28px',
              }}>⭐</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#F1F5F9', marginBottom: '8px' }}>
                Требуется Premium план
              </h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.6' }}>
                API-доступ и расширенные интеграции доступны на тарифах Professional и Enterprise.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {[
                'Полный доступ к REST API',
                'Webhook-уведомления',
                'Интеграция с ГИСЗ Росздравнадзора',
                'Приоритетная поддержка 24/7',
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span style={{ fontSize: '13px', color: '#E2E8F0' }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowPremiumModal(false)}
                style={{
                  flex: 1,
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}>Отмена</button>
              <button
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #F97416, #EA580C)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}>Обновить план</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
