import React, { useState } from 'react'
import { regulatoryNews } from '../data/mockData.js'

const PROGNOSIS_DATA = {
  'Медицинское изделие': {
    '1': [
      { stage: 'Подготовка досье', min: 1, max: 2 },
      { stage: 'Внутренняя проверка', min: 0.5, max: 1 },
      { stage: 'Подача и регистрация', min: 0.5, max: 1 },
      { stage: 'Экспертиза Росздравнадзора', min: 1, max: 2 },
      { stage: 'Получение РУ', min: 0.5, max: 1 },
    ],
    '2а': [
      { stage: 'Подготовка досье', min: 1.5, max: 2.5 },
      { stage: 'Внутренняя проверка', min: 0.5, max: 1 },
      { stage: 'Подача и регистрация', min: 0.5, max: 1 },
      { stage: 'Экспертиза Росздравнадзора', min: 2, max: 3 },
      { stage: 'Получение РУ', min: 0.5, max: 1 },
    ],
    '2б': [
      { stage: 'Подготовка досье', min: 2, max: 3 },
      { stage: 'Клинические исследования', min: 3, max: 6 },
      { stage: 'Внутренняя проверка', min: 1, max: 1.5 },
      { stage: 'Подача и регистрация', min: 0.5, max: 1 },
      { stage: 'Экспертиза Росздравнадзора', min: 3, max: 4 },
      { stage: 'Получение РУ', min: 0.5, max: 1 },
    ],
    '3': [
      { stage: 'Подготовка досье', min: 3, max: 5 },
      { stage: 'Клинические исследования', min: 6, max: 12 },
      { stage: 'Внутренняя проверка', min: 1.5, max: 2 },
      { stage: 'Подача и регистрация', min: 0.5, max: 1 },
      { stage: 'Экспертиза Росздравнадзора', min: 4, max: 6 },
      { stage: 'Получение РУ', min: 0.5, max: 1 },
    ],
  },
  'Программное обеспечение': {
    '2а': [
      { stage: 'Разработка по IEC 62304', min: 2, max: 4 },
      { stage: 'Верификация и валидация', min: 1, max: 2 },
      { stage: 'Подготовка досье', min: 1, max: 2 },
      { stage: 'Экспертиза', min: 2, max: 3 },
      { stage: 'Получение РУ', min: 0.5, max: 1 },
    ],
    '2б': [
      { stage: 'Разработка по IEC 62304', min: 3, max: 6 },
      { stage: 'Верификация и валидация', min: 2, max: 3 },
      { stage: 'Клиническая валидация', min: 2, max: 4 },
      { stage: 'Подготовка досье', min: 1.5, max: 2.5 },
      { stage: 'Экспертиза', min: 3, max: 4 },
      { stage: 'Получение РУ', min: 0.5, max: 1 },
    ],
  },
  'ИИ-система': {
    '3': [
      { stage: 'Разработка и обучение модели', min: 4, max: 8 },
      { stage: 'Клиническая валидация (рос. данные)', min: 6, max: 12 },
      { stage: 'Аудит алгоритма', min: 1, max: 2 },
      { stage: 'Подготовка досье', min: 2, max: 3 },
      { stage: 'Экспертиза Росздравнадзора', min: 4, max: 6 },
      { stage: 'Получение РУ', min: 1, max: 2 },
    ],
  },
}

function CriticalityBadge({ level }) {
  const cfg = {
    'Критично': { bg: '#EF44441A', color: '#EF4444', border: '#EF444430' },
    'Важно': { bg: '#EAB3081A', color: '#EAB308', border: '#EAB30830' },
    'Информация': { bg: '#9966FF1A', color: '#9966FF', border: '#9966FF30' },
  }
  const c = cfg[level] || cfg['Информация']
  return (
    <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, borderRadius: '5px', padding: '2px 8px', fontSize: '10px', fontWeight: '700' }}>
      {level.toUpperCase()}
    </span>
  )
}

export default function Compliance() {
  const [progType, setProgType] = useState('')
  const [progRisk, setProgRisk] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [calculating, setCalculating] = useState(false)
  const [expandedNews, setExpandedNews] = useState(new Set())

  const handleCalculate = () => {
    setCalculating(true)
    setShowResult(false)
    setTimeout(() => {
      setCalculating(false)
      setShowResult(true)
    }, 1200)
  }

  const prognosisData = progType && progRisk
    ? (PROGNOSIS_DATA[progType]?.[progRisk] || null)
    : null

  const totalMin = prognosisData ? prognosisData.reduce((s, r) => s + r.min, 0) : 0
  const totalMax = prognosisData ? prognosisData.reduce((s, r) => s + r.max, 0) : 0

  const riskOptions = progType ? Object.keys(PROGNOSIS_DATA[progType] || {}) : ['1', '2а', '2б', '3']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '16px', alignItems: 'start' }}>
        {/* News feed */}
        <div style={{
          background: '#1E293B',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#F1F5F9', margin: 0 }}>
              Нормативные изменения
            </h3>
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              Обновлено: {new Date().toLocaleDateString('ru-RU')}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {regulatoryNews.map(news => {
              const isExpanded = expandedNews.has(news.id)
              return (
                <div key={news.id} style={{
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#475569'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#334155'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <CriticalityBadge level={news.criticality} />
                        <span style={{ fontSize: '11px', color: '#64748B' }}>
                          {new Date(news.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#E2E8F0', margin: 0, lineHeight: '1.4' }}>
                        {news.title}
                      </h4>
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0, lineHeight: '1.6' }}>
                    {isExpanded ? news.description : news.description.slice(0, 100) + (news.description.length > 100 ? '...' : '')}
                  </p>
                  <button
                    onClick={() => setExpandedNews(s => {
                      const n = new Set(s)
                      n.has(news.id) ? n.delete(news.id) : n.add(news.id)
                      return n
                    })}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9966FF',
                      fontSize: '12px',
                      cursor: 'pointer',
                      padding: '6px 0 0',
                      fontFamily: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {isExpanded ? 'Свернуть ↑' : 'Подробнее →'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Prognosis */}
        <div style={{
          background: '#1E293B',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#F1F5F9', margin: '0 0 16px' }}>
            Прогноз регистрации
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px', fontWeight: '500' }}>
                Тип изделия
              </label>
              <select
                value={progType}
                onChange={e => { setProgType(e.target.value); setProgRisk(''); setShowResult(false) }}
                style={{
                  width: '100%',
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  fontSize: '13px',
                  color: progType ? '#F1F5F9' : '#64748B',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <option value="">Выберите тип...</option>
                <option>Медицинское изделие</option>
                <option>Программное обеспечение</option>
                <option>ИИ-система</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '8px', fontWeight: '500' }}>
                Класс риска
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {riskOptions.map(cls => (
                  <label key={cls} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${progRisk === cls ? '#9966FF' : '#334155'}`,
                    background: progRisk === cls ? '#2D1B69' : '#0F172A',
                    transition: 'all 0.15s',
                  }}>
                    <input
                      type="radio"
                      name="progRisk"
                      value={cls}
                      checked={progRisk === cls}
                      onChange={e => { setProgRisk(e.target.value); setShowResult(false) }}
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: progRisk === cls ? '#9966FF' : '#64748B' }}>
                      {cls}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={!progType || !progRisk || calculating}
              style={{
                background: !progType || !progRisk ? '#334155' : 'linear-gradient(135deg, #9966FF, #7B44EE)',
                border: 'none',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '13px',
                fontWeight: '600',
                color: !progType || !progRisk ? '#64748B' : 'white',
                cursor: !progType || !progRisk ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {calculating ? (
                <>
                  <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12"/>
                  </svg>
                  Рассчитывается...
                </>
              ) : 'Рассчитать прогноз'}
            </button>

            {showResult && prognosisData && (
              <div style={{ borderTop: '1px solid #334155', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8' }}>Сроки по этапам</span>
                  <span style={{
                    background: '#9966FF1A',
                    color: '#9966FF',
                    borderRadius: '6px',
                    padding: '3px 10px',
                    fontSize: '12px',
                    fontWeight: '700',
                  }}>
                    Итого: {totalMin}–{totalMax} мес.
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {prognosisData.map((row, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 10px',
                      background: '#0F172A',
                      borderRadius: '7px',
                    }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: '#2D1B69',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: '700',
                          color: '#9966FF',
                          flexShrink: 0,
                        }}>{i + 1}</div>
                        <span style={{ fontSize: '12px', color: '#CBD5E1' }}>{row.stage}</span>
                      </div>
                      <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                        {row.min}–{row.max} мес.
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: '12px',
                  background: '#EAB3081A',
                  border: '1px solid #EAB30820',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '11px',
                  color: '#94A3B8',
                  lineHeight: '1.5',
                }}>
                  <span style={{ color: '#EAB308', fontWeight: '600' }}>Прим.: </span>
                  Сроки являются ориентировочными и зависят от полноты документации и загруженности Росздравнадзора. При наличии критических замечаний сроки могут увеличиться на 20–40%.
                </div>
              </div>
            )}

            {showResult && !prognosisData && (
              <div style={{
                background: '#EF44441A',
                border: '1px solid #EF444430',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '12px',
                color: '#94A3B8',
              }}>
                Для данной комбинации типа и класса риска прогноз ещё не сформирован. Обратитесь к консультанту.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compliance summary */}
      <div style={{
        background: '#1E293B',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '20px',
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#F1F5F9', margin: '0 0 16px' }}>
          Соответствие нормативной базе
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { name: 'ЕАЭС 2017/28', status: 'compliant', pct: 72, color: '#EAB308' },
            { name: 'ГОСТ Р ИСО 14971', status: 'compliant', pct: 88, color: '#22C55E' },
            { name: 'ГОСТ Р ИСО 13485', status: 'partial', pct: 55, color: '#EAB308' },
            { name: 'IEC 62304', status: 'warning', pct: 40, color: '#EF4444' },
          ].map(r => (
            <div key={r.name} style={{
              background: '#0F172A',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '16px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#E2E8F0', marginBottom: '10px' }}>{r.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '22px', fontWeight: '700', color: r.color }}>{r.pct}%</span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: r.status === 'compliant' ? '#22C55E' : r.status === 'partial' ? '#EAB308' : '#EF4444',
                  background: r.status === 'compliant' ? '#22C55E1A' : r.status === 'partial' ? '#EAB3081A' : '#EF44441A',
                  borderRadius: '4px',
                  padding: '2px 6px',
                }}>
                  {r.status === 'compliant' ? 'ОК' : r.status === 'partial' ? 'ЧАСТИЧНО' : 'НАРУШЕНИЕ'}
                </span>
              </div>
              <div style={{ height: '4px', background: '#334155', borderRadius: '2px' }}>
                <div style={{ width: `${r.pct}%`, height: '100%', background: r.color, borderRadius: '2px' }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
