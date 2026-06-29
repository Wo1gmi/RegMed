import React, { useState } from 'react'
import { auditSections, auditIssues } from '../data/mockData.js'

const statusDot = { ok: '#22C55E', warning: '#EAB308', error: '#EF4444' }

function Dot({ status }) {
  return (
    <div style={{
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: statusDot[status],
      flexShrink: 0,
    }}/>
  )
}

const SECTION_CONTENT = {
  '1.1': {
    title: 'Заявка на регистрацию',
    text: `Настоящая заявка подаётся в Федеральную службу по надзору в сфере здравоохранения (Росздравнадзор) на основании Постановления Правительства РФ № 1416 от 27.12.2012 г.

Заявитель: ООО «МедТех Инновации», ОГРН 1234567890123, юридический адрес: г. Москва, ул. Академика Варги, д. 8, стр. 1.

Наименование изделия: Кардиомонитор CM-100. Предполагаемое назначение: непрерывный мониторинг электрокардиографических показателей пациентов в условиях стационара.

Класс риска: 2б. Код номенклатурного классификатора: A 12.05.003.`,
    highlights: [
      { text: 'Постановления Правительства РФ № 1416', type: 'ok', tooltip: { req: 'Требование: ст. 38 ФЗ-323', suggestion: 'Ссылка корректна, документ действующий.' } },
    ],
  },
  '2.2': {
    title: 'Принцип действия',
    text: `Кардиомонитор CM-100 осуществляет непрерывную регистрацию и анализ электрокардиограммы пациента с использованием адаптивного алгоритма обработки сигналов.

Изделие оснащено процессором обработки данных и встроенным модулем беспроводной передачи данных по протоколу IEEE 802.11 (Wi-Fi) и Bluetooth 5.0.

Принцип действия основан на дифференциальном усилении биопотенциалов с последующей цифровой фильтрацией и анализом в реальном времени. Алгоритм автоматически детектирует аритмии и критические изменения ритма.`,
    highlights: [
      { text: 'IEEE 802.11 (Wi-Fi) и Bluetooth 5.0', type: 'warning', tooltip: { req: 'Требование: ГОСТ Р ИСО 80001-1-2011, п. 4.2. Необходимо указать меры по обеспечению безопасности беспроводной передачи данных.', suggestion: 'Добавить раздел о шифровании данных (AES-256) и аутентификации при беспроводной передаче.' } },
      { text: 'алгоритм автоматически детектирует аритмии', type: 'warning', tooltip: { req: 'Требование: МУ Росздравнадзора 2023-2. Для алгоритмов автоматической диагностики требуется подтверждение чувствительности ≥95% и специфичности ≥90%.', suggestion: 'Добавить таблицу с показателями диагностической точности алгоритма, полученными в ходе клинической валидации.' } },
    ],
  },
  '2.3': {
    title: 'Состав комплекта поставки',
    text: `Комплект поставки кардиомонитора CM-100 включает:

1. Монитор кардиологический CM-100 — 1 шт.
2. Блок питания AC/DC 12В/2А — 1 шт.
3. Кабель USB Type-C — 1 шт.

Комплект не содержит информации о сменных электродах и аксессуарах. Срок службы основного блока не указан.`,
    highlights: [
      { text: 'Комплект не содержит информации о сменных электродах', type: 'error', tooltip: { req: 'Требование: ГОСТ Р 51000.4-2011, п. 5.2. Перечень сменных компонентов и аксессуаров является обязательным разделом технической документации.', suggestion: 'Добавить полный перечень сменных компонентов: электроды, кабели отведений, держатель аккумулятора — с артикулами и сроками службы.' } },
      { text: 'Срок службы основного блока не указан', type: 'error', tooltip: { req: 'Требование: ГОСТ Р МЭК 60601-1-2011, п. 7.2. Срок службы изделия должен быть определён и указан в документации.', suggestion: 'Добавить раздел "Ресурс и срок службы" с указанием расчётного срока эксплуатации (рекомендовано: 5 лет).' } },
    ],
  },
  '3.1': {
    title: 'Клинические исследования',
    text: `Раздел клинических исследований находится в стадии подготовки.

В настоящее время данный раздел не содержит результатов клинических испытаний для подтверждения безопасности и эффективности изделия. Требуется проведение клинической оценки в соответствии с действующими нормативными требованиями.`,
    highlights: [
      { text: 'не содержит результатов клинических испытаний', type: 'error', tooltip: { req: 'Требование: ГОСТ Р ИСО 14155-2014. Для изделий класса риска 2б обязательно предоставление клинических данных, полученных в ходе исследований или из опубликованной литературы.', suggestion: 'Провести или заказать клиническое исследование с участием не менее 50 пациентов. Альтернатива: систематический обзор эквивалентных изделий (не менее 5 публикаций).' } },
    ],
  },
  '5.1': {
    title: 'Этикетка изделия',
    text: `Маркировка кардиомонитора CM-100 содержит следующую информацию:
— Наименование производителя и адрес
— Наименование изделия
— Дата изготовления
— Напряжение питания: 12В DC
— Символ «Беречь от влаги»

Маркировка не содержит символ UDI (Unique Device Identification).`,
    highlights: [
      { text: 'не содержит символ UDI', type: 'error', tooltip: { req: 'Требование: Решение ЕАЭС №46, п. 8. С 2024 года нанесение UDI-DI и UDI-PI на этикетку является обязательным для изделий 2б и 3 класса.', suggestion: 'Нанести UDI в формате GS1 DataMatrix: UDI-DI (идентификатор изделия) и UDI-PI (идентификатор производственной единицы).' } },
    ],
  },
}

const defaultContent = {
  title: 'Выберите раздел',
  text: 'Выберите раздел в дереве слева для просмотра содержимого и замечаний аудита.',
  highlights: [],
}

function PriorityBadge({ priority }) {
  const cfg = {
    'Критично': { bg: '#EF44441A', color: '#EF4444' },
    'Важно': { bg: '#EAB3081A', color: '#EAB308' },
    'Рекомендация': { bg: '#9966FF1A', color: '#9966FF' },
  }
  const c = cfg[priority] || { bg: '#94A3B81A', color: '#94A3B8' }
  return (
    <span style={{ background: c.bg, color: c.color, borderRadius: '5px', padding: '2px 7px', fontSize: '10px', fontWeight: '700' }}>
      {priority.toUpperCase()}
    </span>
  )
}

export default function Audit() {
  const [expandedSections, setExpandedSections] = useState({ 1: true, 2: true, 3: true })
  const [selectedSection, setSelectedSection] = useState('3.1')
  const [resolvedIssues, setResolvedIssues] = useState(new Set())
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [auditProgress, setAuditProgress] = useState(0)
  const [auditRunning, setAuditRunning] = useState(false)
  const [auditDone, setAuditDone] = useState(false)

  const content = SECTION_CONTENT[selectedSection] || defaultContent

  const runAudit = () => {
    setShowAuditModal(true)
    setAuditProgress(0)
    setAuditRunning(true)
    setAuditDone(false)
    let p = 0
    const iv = setInterval(() => {
      p += Math.random() * 12 + 3
      if (p >= 100) {
        p = 100
        clearInterval(iv)
        setAuditRunning(false)
        setAuditDone(true)
      }
      setAuditProgress(Math.min(p, 100))
    }, 250)
  }

  const visibleIssues = auditIssues.filter(i => !resolvedIssues.has(i.id))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: 'calc(100vh - 128px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '13px', color: '#64748B' }}>Кардиомонитор CM-100</div>
        </div>
        <button
          onClick={runAudit}
          style={{
            background: 'linear-gradient(135deg, #9966FF, #7B44EE)',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'white',
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Запустить полный аудит
        </button>
      </div>

      {/* 3-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 320px', gap: '16px', flex: 1, minHeight: 0 }}>
        {/* Left: Section tree */}
        <div style={{
          background: '#1E293B',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '16px',
          overflowY: 'auto',
        }}>
          <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Разделы досье
          </h3>
          {auditSections.map(section => (
            <div key={section.id}>
              <button
                onClick={() => setExpandedSections(e => ({ ...e, [section.id]: !e[section.id] }))}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#334155'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Dot status={section.status} />
                <span style={{ fontSize: '13px', color: '#E2E8F0', fontWeight: '500', flex: 1, textAlign: 'left' }}>
                  {section.id}. {section.title}
                </span>
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"
                  style={{ transform: expandedSections[section.id] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {expandedSections[section.id] && (
                <div style={{ paddingLeft: '20px', marginBottom: '4px' }}>
                  {section.subsections.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSection(sub.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: 'none',
                        background: selectedSection === sub.id ? '#2D1B69' : 'transparent',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { if (selectedSection !== sub.id) e.currentTarget.style.background = '#334155' }}
                      onMouseLeave={(e) => { if (selectedSection !== sub.id) e.currentTarget.style.background = 'transparent' }}
                    >
                      <Dot status={sub.status} />
                      <span style={{ fontSize: '12px', color: selectedSection === sub.id ? '#9966FF' : '#94A3B8', textAlign: 'left' }}>
                        {sub.id} {sub.title}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Center: Content editor */}
        <div style={{
          background: '#1E293B',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>Раздел {selectedSection}</div>
              <h2 style={{ fontSize: '17px', fontWeight: '600', color: '#F1F5F9', margin: 0 }}>{content.title}</h2>
            </div>
            <button style={{
              background: '#0F172A',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '7px 14px',
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
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Редактировать
            </button>
          </div>

          <div style={{
            background: '#0F172A',
            border: '1px solid #334155',
            borderRadius: '10px',
            padding: '20px',
            fontSize: '13px',
            lineHeight: '1.8',
            color: '#CBD5E1',
          }}>
            <ContentWithHighlights text={content.text} highlights={content.highlights} />
          </div>
        </div>

        {/* Right: Issues panel */}
        <div style={{
          background: '#1E293B',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#94A3B8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Замечания
            </h3>
            <span style={{
              background: '#EF44441A',
              color: '#EF4444',
              borderRadius: '10px',
              padding: '1px 8px',
              fontSize: '11px',
              fontWeight: '700',
            }}>{visibleIssues.length}</span>
          </div>

          {visibleIssues.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#22C55E' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 12px' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <div style={{ fontSize: '13px' }}>Все замечания устранены!</div>
            </div>
          ) : (
            visibleIssues.map(issue => (
              <div key={issue.id} style={{
                background: '#0F172A',
                border: `1px solid ${issue.priority === 'Критично' ? '#EF444430' : issue.priority === 'Важно' ? '#EAB30830' : '#334155'}`,
                borderRadius: '8px',
                padding: '12px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <PriorityBadge priority={issue.priority} />
                  <span style={{ fontSize: '10px', color: '#475569' }}>§{issue.section}</span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#E2E8F0', marginBottom: '6px', lineHeight: '1.4' }}>
                  {issue.title}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.5', marginBottom: '10px' }}>
                  {issue.description}
                </div>
                <div style={{
                  background: '#9966FF0D',
                  border: '1px solid #9966FF20',
                  borderRadius: '6px',
                  padding: '8px',
                  fontSize: '11px',
                  color: '#94A3B8',
                  lineHeight: '1.5',
                  marginBottom: '10px',
                }}>
                  <span style={{ color: '#9966FF', fontWeight: '600' }}>Предложение: </span>
                  {issue.suggestion}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setResolvedIssues(s => new Set([...s, issue.id]))}
                    style={{
                      flex: 1,
                      background: '#22C55E1A',
                      border: '1px solid #22C55E30',
                      color: '#22C55E',
                      borderRadius: '6px',
                      padding: '5px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}>Принять</button>
                  <button
                    onClick={() => setResolvedIssues(s => new Set([...s, issue.id]))}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: '1px solid #334155',
                      color: '#64748B',
                      borderRadius: '6px',
                      padding: '5px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}>Отклонить</button>
                </div>
              </div>
            ))
          )}

          <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #334155' }}>
            <button style={{
              width: '100%',
              background: '#0F172A',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#94A3B8',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Экспорт протокола (PDF)
            </button>
          </div>
        </div>
      </div>

      {/* Audit modal */}
      {showAuditModal && (
        <div className="modal-backdrop" onClick={() => { if (auditDone) setShowAuditModal(false) }}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#F1F5F9', marginBottom: '12px' }}>
              {auditDone ? 'Аудит завершён' : 'Запуск полного аудита...'}
            </h3>
            {auditRunning && (
              <>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px' }}>
                  Проверяем все разделы досье на соответствие требованиям ЕАЭС 2017/28, ГОСТ Р и Росздравнадзора...
                </p>
                <div style={{ background: '#0F172A', borderRadius: '8px', height: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                  <div style={{
                    width: `${auditProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #9966FF, #7B44EE)',
                    borderRadius: '8px',
                    transition: 'width 0.3s',
                  }}/>
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', textAlign: 'right' }}>{Math.round(auditProgress)}%</div>
              </>
            )}
            {auditDone && (
              <>
                <div style={{
                  background: '#22C55E1A',
                  border: '1px solid #22C55E30',
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: '20px',
                }}>
                  <div style={{ fontSize: '14px', color: '#22C55E', fontWeight: '600', marginBottom: '8px' }}>Аудит завершён успешно</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {[
                      { label: 'Проверено разделов', val: '17/17' },
                      { label: 'Критических замечаний', val: '3', color: '#EF4444' },
                      { label: 'Важных замечаний', val: '2', color: '#EAB308' },
                      { label: 'Рекомендаций', val: '1', color: '#9966FF' },
                    ].map(r => (
                      <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: '#94A3B8' }}>{r.label}</span>
                        <span style={{ color: r.color || '#F1F5F9', fontWeight: '600' }}>{r.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setShowAuditModal(false)}
                  style={{
                    width: '100%',
                    background: '#9966FF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'white',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >Перейти к замечаниям</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ContentWithHighlights({ text, highlights }) {
  if (!highlights || highlights.length === 0) {
    return <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>{text}</pre>
  }

  let parts = [{ text, type: 'plain' }]

  for (const h of highlights) {
    const newParts = []
    for (const part of parts) {
      if (part.type !== 'plain') {
        newParts.push(part)
        continue
      }
      const idx = part.text.indexOf(h.text)
      if (idx === -1) {
        newParts.push(part)
        continue
      }
      if (idx > 0) newParts.push({ text: part.text.slice(0, idx), type: 'plain' })
      newParts.push({ text: h.text, type: h.type, tooltip: h.tooltip })
      if (idx + h.text.length < part.text.length) newParts.push({ text: part.text.slice(idx + h.text.length), type: 'plain' })
    }
    parts = newParts
  }

  return (
    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
      {parts.map((p, i) => {
        if (p.type === 'plain') return p.text
        return (
          <span key={i} className="tooltip-container" style={{ position: 'relative' }}>
            <span
              className={p.type === 'error' ? 'highlight-red' : 'highlight-yellow'}
            >
              {p.text}
            </span>
            {p.tooltip && (
              <span className="tooltip-box" style={{
                display: 'none',
                position: 'absolute',
                bottom: '100%',
                left: '0',
                marginBottom: '8px',
                background: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '12px',
                width: '280px',
                fontSize: '12px',
                color: '#F1F5F9',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                zIndex: 9999,
                pointerEvents: 'none',
                whiteSpace: 'normal',
              }}>
                <div style={{ color: '#EAB308', fontWeight: '600', marginBottom: '6px', fontSize: '11px' }}>
                  {p.tooltip.req}
                </div>
                <div style={{ color: '#94A3B8', lineHeight: '1.5', fontSize: '11px' }}>
                  <span style={{ color: '#9966FF', fontWeight: '600' }}>Предложение: </span>
                  {p.tooltip.suggestion}
                </div>
              </span>
            )}
          </span>
        )
      })}
    </pre>
  )
}
