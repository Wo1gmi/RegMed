import React, { useState } from 'react'
import { dossiers } from '../data/mockData.js'

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
    <span style={{ background: c.bg, color: c.color, borderRadius: '6px', padding: '3px 9px', fontSize: '11px', fontWeight: '600' }}>
      {status}
    </span>
  )
}

function ProgressBar({ value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ flex: 1, height: '6px', background: '#334155', borderRadius: '3px', minWidth: '80px' }}>
        <div style={{ width: `${value}%`, height: '100%', background: 'linear-gradient(90deg, #9966FF, #7B44EE)', borderRadius: '3px' }}/>
      </div>
      <span style={{ fontSize: '12px', color: '#94A3B8', minWidth: '32px' }}>{value}%</span>
    </div>
  )
}

const KANBAN_COLS = ['Подготовка', 'На проверке', 'Замечания', 'Готово']

const colColors = {
  'Подготовка': '#94A3B8',
  'На проверке': '#EAB308',
  'Замечания': '#EF4444',
  'Готово': '#22C55E',
}

export default function Dossiers({ setCurrentPage, filters, setFilters }) {
  const [view, setView] = useState('table')
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState(filters.riskClass || '')
  const [typeFilter, setTypeFilter] = useState(filters.type || '')

  const filtered = dossiers.filter(d => {
    if (riskFilter && d.riskClass !== riskFilter) return false
    if (typeFilter && d.type !== typeFilter) return false
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleRiskChange = (val) => {
    setRiskFilter(val)
    setFilters(f => ({ ...f, riskClass: val }))
  }
  const handleTypeChange = (val) => {
    setTypeFilter(val)
    setFilters(f => ({ ...f, type: val }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Toolbar */}
      <div style={{
        background: '#1E293B',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по названию..."
            style={{
              width: '100%',
              background: '#0F172A',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '8px 12px 8px 36px',
              fontSize: '13px',
              color: '#F1F5F9',
              outline: 'none',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => e.target.style.borderColor = '#9966FF'}
            onBlur={(e) => e.target.style.borderColor = '#334155'}
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"
            style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>

        {/* Risk class filter */}
        <select
          value={riskFilter}
          onChange={e => handleRiskChange(e.target.value)}
          style={{
            background: '#0F172A',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '13px',
            color: riskFilter ? '#F1F5F9' : '#64748B',
            outline: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <option value="">Все классы риска</option>
          <option value="1">Класс 1</option>
          <option value="2а">Класс 2а</option>
          <option value="2б">Класс 2б</option>
          <option value="3">Класс 3</option>
        </select>

        {/* Type filter */}
        <select
          value={typeFilter}
          onChange={e => handleTypeChange(e.target.value)}
          style={{
            background: '#0F172A',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '13px',
            color: typeFilter ? '#F1F5F9' : '#64748B',
            outline: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <option value="">Все типы</option>
          <option value="МИ">МИ</option>
          <option value="ПО">ПО</option>
          <option value="ИИ">ИИ-система</option>
        </select>

        {(riskFilter || typeFilter || search) && (
          <button
            onClick={() => { setRiskFilter(''); setTypeFilter(''); setSearch(''); setFilters({}) }}
            style={{
              background: 'none',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '12px',
              color: '#94A3B8',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Сбросить
          </button>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
          {[
            { id: 'table', label: 'Таблица', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg> },
            { id: 'kanban', label: 'Канбан', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/></svg> },
          ].map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: view === v.id ? '#2D1B69' : '#0F172A',
                color: view === v.id ? '#9966FF' : '#94A3B8',
                border: `1px solid ${view === v.id ? '#9966FF30' : '#334155'}`,
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: view === v.id ? '600' : '400',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {v.icon} {v.label}
            </button>
          ))}
        </div>
      </div>

      {view === 'table' ? (
        <TableView dossiers={filtered} setCurrentPage={setCurrentPage} />
      ) : (
        <KanbanView dossiers={filtered} setCurrentPage={setCurrentPage} />
      )}
    </div>
  )
}

function TableView({ dossiers, setCurrentPage }) {
  return (
    <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #334155' }}>
            {['Наименование', 'Тип', 'Класс риска', 'Статус', 'Прогресс', 'Обновлено', 'Действия'].map(col => (
              <th key={col} style={{
                padding: '12px 16px',
                textAlign: 'left',
                color: '#64748B',
                fontWeight: '500',
                fontSize: '12px',
                background: '#1E293B',
              }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dossiers.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                Досье не найдены. Попробуйте изменить фильтры.
              </td>
            </tr>
          ) : dossiers.map((d) => (
            <tr key={d.id}
              style={{ borderBottom: '1px solid #1E293B', cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#334155'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ padding: '13px 16px' }}>
                <div style={{ fontWeight: '500', color: '#E2E8F0' }}>{d.name}</div>
                {d.issues > 0 && (
                  <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '2px' }}>
                    {d.issues} замеч.
                  </div>
                )}
              </td>
              <td style={{ padding: '13px 16px', color: '#94A3B8' }}>{d.type}</td>
              <td style={{ padding: '13px 16px' }}>
                <span style={{
                  background: d.riskClass === '3' ? '#EF44441A' : d.riskClass.startsWith('2') ? '#EAB3081A' : '#22C55E1A',
                  color: d.riskClass === '3' ? '#EF4444' : d.riskClass.startsWith('2') ? '#EAB308' : '#22C55E',
                  borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: '600',
                }}>Класс {d.riskClass}</span>
              </td>
              <td style={{ padding: '13px 16px' }}><StatusBadge status={d.status} /></td>
              <td style={{ padding: '13px 16px', minWidth: '140px' }}><ProgressBar value={d.progress} /></td>
              <td style={{ padding: '13px 16px', color: '#64748B' }}>
                {new Date(d.updatedAt).toLocaleDateString('ru-RU')}
              </td>
              <td style={{ padding: '13px 16px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setCurrentPage('audit')}
                    style={{
                      background: '#9966FF1A',
                      border: '1px solid #9966FF30',
                      color: '#9966FF',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}>Открыть</button>
                  <button
                    onClick={() => setCurrentPage('audit')}
                    style={{
                      background: 'transparent',
                      border: '1px solid #334155',
                      color: '#94A3B8',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}>Аудит</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function KanbanView({ dossiers, setCurrentPage }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', alignItems: 'start' }}>
      {KANBAN_COLS.map(col => {
        const colDossiers = dossiers.filter(d => d.stage === col)
        return (
          <div key={col} style={{
            background: '#1E293B',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '16px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colColors[col] }}/>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>{col}</span>
              </div>
              <span style={{
                background: '#0F172A',
                color: '#64748B',
                borderRadius: '10px',
                padding: '1px 8px',
                fontSize: '11px',
                fontWeight: '600',
              }}>{colDossiers.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '200px' }}>
              {colDossiers.length === 0 ? (
                <div style={{
                  border: '2px dashed #334155',
                  borderRadius: '8px',
                  padding: '24px',
                  textAlign: 'center',
                  color: '#475569',
                  fontSize: '12px',
                }}>Нет досье</div>
              ) : colDossiers.map(d => (
                <div key={d.id} style={{
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#9966FF'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#334155'}
                >
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#E2E8F0', marginBottom: '6px' }}>{d.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>{d.type} · Класс {d.riskClass}</span>
                    {d.issues > 0 && (
                      <span style={{ fontSize: '10px', background: '#EF44441A', color: '#EF4444', borderRadius: '4px', padding: '1px 5px', fontWeight: '600' }}>
                        {d.issues}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <div style={{ flex: 1, height: '4px', background: '#334155', borderRadius: '2px' }}>
                      <div style={{ width: `${d.progress}%`, height: '100%', background: '#9966FF', borderRadius: '2px' }}/>
                    </div>
                    <span style={{ fontSize: '10px', color: '#64748B' }}>{d.progress}%</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => setCurrentPage('audit')}
                      style={{
                        flex: 1,
                        background: '#9966FF1A',
                        border: '1px solid #9966FF30',
                        color: '#9966FF',
                        borderRadius: '5px',
                        padding: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}>Открыть</button>
                    <button
                      onClick={() => setCurrentPage('audit')}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: '1px solid #334155',
                        color: '#94A3B8',
                        borderRadius: '5px',
                        padding: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}>Аудит</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
