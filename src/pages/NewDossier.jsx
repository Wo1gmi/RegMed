import React, { useState, useRef } from 'react'

const STEPS = ['Характеристики изделия', 'Структура досье', 'Загрузка документов']

const SECTIONS_TEMPLATE = [
  'Административная информация',
  'Описание изделия',
  'Клинические данные',
  'Технические характеристики',
  'Маркировка и инструкция',
  'Управление рисками',
  'Послерегистрационный надзор',
]

const AI_SECTIONS = {
  'ИИ-система': [
    'Административная информация',
    'Описание ИИ-системы и архитектуры',
    'Обучающий датасет и методология',
    'Клиническая валидация',
    'Технические характеристики',
    'Управление рисками (ISO 14971)',
    'Кибербезопасность',
    'Маркировка и инструкция',
  ],
  'Программное обеспечение': [
    'Административная информация',
    'Описание программного обеспечения',
    'Жизненный цикл разработки ПО (IEC 62304)',
    'Верификация и валидация',
    'Управление рисками',
    'Кибербезопасность',
    'Маркировка и инструкция',
  ],
}

function getRiskClass(type, area) {
  if (type === 'ИИ-система') return { cls: '3', reason: 'ИИ-системы для диагностики по умолчанию относятся к классу риска 3 согласно Решению ЕАЭС №46 и требованиям Росздравнадзора.' }
  if (type === 'Программное обеспечение') return { cls: '2а', reason: 'Медицинское ПО без функций диагностики, как правило, относится к классу 2а согласно ГОСТ Р МЭК 62304.' }
  if (area === 'Кардиология' || area === 'Нейрология') return { cls: '2б', reason: 'Медицинские изделия в кардиологии и нейрологии относятся к классу 2б в соответствии с Приложением к Решению ЕАЭС 2017/28.' }
  return { cls: '1', reason: 'Изделие не имеет прямого контакта с пациентом и не обрабатывает критичные физиологические параметры.' }
}

export default function NewDossier({ setCurrentPage }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    type: '',
    area: '',
    riskClass: '',
  })
  const [selectedSections, setSelectedSections] = useState([])
  const [complianceBase, setComplianceBase] = useState('ЕАЭС 2017/28')
  const [editedSections, setEditedSections] = useState([])
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState(false)
  const fileRef = useRef(null)

  const riskInfo = form.type ? getRiskClass(form.type, form.area) : null
  const sections = SECTIONS_TEMPLATE
  const step1Valid = form.name && form.type && form.area

  const handleNext = () => {
    if (step === 1) {
      const secs = AI_SECTIONS[form.type] || SECTIONS_TEMPLATE
      setSelectedSections(secs)
      setEditedSections(secs.map(s => s))
    }
    setStep(s => s + 1)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const newFiles = Array.from(e.dataTransfer.files)
    addFiles(newFiles)
  }

  const addFiles = (newFiles) => {
    const mapped = newFiles.map(f => ({
      name: f.name,
      size: f.size,
      section: autoAssignSection(f.name),
    }))
    setFiles(prev => [...prev, ...mapped])
  }

  const autoAssignSection = (name) => {
    const n = name.toLowerCase()
    if (n.includes('техн') || n.includes('ту')) return 'Технические характеристики'
    if (n.includes('клин') || n.includes('clinic')) return 'Клинические данные'
    if (n.includes('марк') || n.includes('label') || n.includes('инструк')) return 'Маркировка и инструкция'
    if (n.includes('риск') || n.includes('risk')) return 'Управление рисками'
    if (n.includes('описан') || n.includes('descript')) return 'Описание изделия'
    return 'Административная информация'
  }

  const handleCreate = () => {
    setCreating(true)
    setTimeout(() => {
      setCreating(false)
      setCreated(true)
    }, 2000)
  }

  if (created) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: '20px',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: '#22C55E1A',
          border: '2px solid #22C55E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#22C55E',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#F1F5F9', margin: 0 }}>Досье создано успешно!</h2>
        <p style={{ fontSize: '14px', color: '#94A3B8', textAlign: 'center', maxWidth: '400px', margin: 0 }}>
          Досье «{form.name}» создано и добавлено в список. Вы можете перейти к аудиту для проверки документов.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setCurrentPage('dossiers')}
            style={{
              background: '#1E293B',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#F1F5F9',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}>К списку досье</button>
          <button
            onClick={() => setCurrentPage('audit')}
            style={{
              background: '#9966FF',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'white',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}>Запустить аудит</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '760px' }}>
      {/* Step indicator */}
      <div style={{
        background: '#1E293B',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '20px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
          {STEPS.map((s, i) => {
            const num = i + 1
            const done = step > num
            const active = step === num
            return (
              <React.Fragment key={s}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    background: done ? '#22C55E' : active ? '#9966FF' : '#334155',
                    color: (done || active) ? 'white' : '#64748B',
                    border: active ? '2px solid #9966FF' : 'none',
                    transition: 'all 0.3s',
                  }}>
                    {done ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : num}
                  </div>
                  <span style={{ fontSize: '12px', color: active ? '#9966FF' : done ? '#22C55E' : '#64748B', fontWeight: active ? '600' : '400', textAlign: 'center' }}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    flex: 2,
                    height: '2px',
                    background: step > i + 1 ? '#22C55E' : '#334155',
                    marginBottom: '24px',
                    transition: 'background 0.3s',
                  }}/>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div style={{
        background: '#1E293B',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '28px',
      }}>
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#F1F5F9', margin: 0 }}>Характеристики изделия</h2>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94A3B8', marginBottom: '6px', fontWeight: '500' }}>
                Наименование изделия *
              </label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Например: Кардиомонитор CM-200"
                style={{
                  width: '100%',
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#F1F5F9',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#9966FF'}
                onBlur={(e) => e.target.style.borderColor = '#334155'}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94A3B8', marginBottom: '6px', fontWeight: '500' }}>
                  Тип изделия *
                </label>
                <select
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value, riskClass: '' }))}
                  style={{
                    width: '100%',
                    background: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '14px',
                    color: form.type ? '#F1F5F9' : '#64748B',
                    outline: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#9966FF'}
                  onBlur={(e) => e.target.style.borderColor = '#334155'}
                >
                  <option value="">Выберите тип...</option>
                  <option>Медицинское изделие</option>
                  <option>Программное обеспечение</option>
                  <option>ИИ-система</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94A3B8', marginBottom: '6px', fontWeight: '500' }}>
                  Терапевтическая область *
                </label>
                <select
                  value={form.area}
                  onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                  style={{
                    width: '100%',
                    background: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '14px',
                    color: form.area ? '#F1F5F9' : '#64748B',
                    outline: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#9966FF'}
                  onBlur={(e) => e.target.style.borderColor = '#334155'}
                >
                  <option value="">Выберите область...</option>
                  <option>Кардиология</option>
                  <option>Нейрология</option>
                  <option>Онкология</option>
                  <option>Хирургия</option>
                  <option>Диагностика</option>
                  <option>Реабилитация</option>
                  <option>Офтальмология</option>
                  <option>Стоматология</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94A3B8', marginBottom: '10px', fontWeight: '500' }}>
                Класс риска (автоопределение)
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {['1', '2а', '2б', '3'].map(cls => (
                  <label key={cls} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${form.riskClass === cls || (riskInfo && riskInfo.cls === cls && !form.riskClass) ? '#9966FF' : '#334155'}`,
                    background: form.riskClass === cls || (riskInfo && riskInfo.cls === cls && !form.riskClass) ? '#2D1B69' : '#0F172A',
                    transition: 'all 0.15s',
                  }}>
                    <input
                      type="radio"
                      name="riskClass"
                      value={cls}
                      checked={form.riskClass === cls}
                      onChange={e => setForm(f => ({ ...f, riskClass: e.target.value }))}
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: form.riskClass === cls || (riskInfo && riskInfo.cls === cls && !form.riskClass) ? '#9966FF' : '#94A3B8' }}>
                      Класс {cls}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {riskInfo && (
              <div style={{
                background: '#9966FF1A',
                border: '1px solid #9966FF30',
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9966FF" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#9966FF', marginBottom: '4px' }}>
                    Предполагаемый класс риска: {form.riskClass || riskInfo.cls}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.5' }}>{riskInfo.reason}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#F1F5F9', margin: 0 }}>Структура досье</h2>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
              Разделы досье сгенерированы автоматически на основе типа изделия. Отредактируйте при необходимости.
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94A3B8', marginBottom: '8px', fontWeight: '500' }}>
                Нормативная база
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['ЕАЭС 2017/28', 'ГОСТ Р', 'Рег. 1169/2011'].map(base => (
                  <button
                    key={base}
                    onClick={() => setComplianceBase(base)}
                    style={{
                      background: complianceBase === base ? '#2D1B69' : '#0F172A',
                      border: `1px solid ${complianceBase === base ? '#9966FF' : '#334155'}`,
                      color: complianceBase === base ? '#9966FF' : '#94A3B8',
                      borderRadius: '8px',
                      padding: '7px 14px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >{base}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedSections.map((sec, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '10px 14px',
                }}>
                  <input
                    type="checkbox"
                    checked={true}
                    readOnly
                    style={{ accentColor: '#9966FF', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '13px', color: '#94A3B8', minWidth: '28px' }}>{i + 1}.</span>
                  <input
                    value={editedSections[i] || sec}
                    onChange={e => {
                      const arr = [...editedSections]
                      arr[i] = e.target.value
                      setEditedSections(arr)
                    }}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '13px',
                      color: '#E2E8F0',
                      fontFamily: 'inherit',
                    }}
                  />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" style={{ flexShrink: 0 }}>
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#F1F5F9', margin: 0 }}>Загрузка черновиков документов</h2>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
              Загрузите существующие документы. RegMed автоматически определит к какому разделу отнести каждый файл.
            </p>

            {/* Drop zone */}
            <div
              className={`drag-zone${dragActive ? ' active' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragActive ? '#9966FF' : '#334155'}`,
                borderRadius: '12px',
                padding: '48px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragActive ? '#9966FF0A' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ color: dragActive ? '#9966FF' : '#475569', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="16 16 12 12 8 16"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#94A3B8', marginBottom: '4px' }}>
                Перетащите файлы сюда или нажмите для выбора
              </div>
              <div style={{ fontSize: '12px', color: '#475569' }}>
                PDF, DOCX, XLSX — до 50 МБ каждый
              </div>
              <input
                ref={fileRef}
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={e => addFiles(Array.from(e.target.files))}
              />
            </div>

            {/* Demo: simulate files */}
            {files.length === 0 && (
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => addFiles([
                    { name: 'ТУ_КМ-200_v2.docx', size: 245000 },
                    { name: 'Клинические_исследования_отчет.pdf', size: 1820000 },
                    { name: 'Маркировка_этикетка.pdf', size: 540000 },
                    { name: 'Управление_рисками_ISO14971.xlsx', size: 380000 },
                  ])}
                  style={{
                    background: 'none',
                    border: '1px dashed #334155',
                    color: '#64748B',
                    fontSize: '12px',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >+ Добавить демо-файлы</button>
              </div>
            )}

            {files.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#94A3B8', margin: 0 }}>
                  Загружено файлов: {files.length}
                </h4>
                {files.map((f, i) => (
                  <div key={i} style={{
                    background: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}>
                    <div style={{ color: '#9966FF', flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', color: '#E2E8F0', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {f.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        {(f.size / 1024).toFixed(0)} КБ
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>→</span>
                      <select
                        value={f.section}
                        onChange={e => {
                          const arr = [...files]
                          arr[i] = { ...f, section: e.target.value }
                          setFiles(arr)
                        }}
                        style={{
                          background: '#1E293B',
                          border: '1px solid #334155',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '11px',
                          color: '#94A3B8',
                          outline: 'none',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                      >
                        {selectedSections.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <button
                      onClick={() => setFiles(files.filter((_, j) => j !== i))}
                      style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: '4px', flexShrink: 0 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={() => step > 1 ? setStep(s => s - 1) : setCurrentPage('dossiers')}
          style={{
            background: '#1E293B',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#94A3B8',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {step > 1 ? '← Назад' : 'Отмена'}
        </button>
        {step < 3 ? (
          <button
            onClick={handleNext}
            disabled={step === 1 && !step1Valid}
            style={{
              background: step === 1 && !step1Valid ? '#334155' : '#9966FF',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              fontSize: '13px',
              fontWeight: '600',
              color: step === 1 && !step1Valid ? '#64748B' : 'white',
              cursor: step === 1 && !step1Valid ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Далее →
          </button>
        ) : (
          <button
            onClick={handleCreate}
            disabled={creating}
            style={{
              background: creating ? '#334155' : '#22C55E',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              fontSize: '13px',
              fontWeight: '600',
              color: creating ? '#64748B' : 'white',
              cursor: creating ? 'wait' : 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {creating ? (
              <>
                <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12"/>
                </svg>
                Создание...
              </>
            ) : '✓ Создать досье'}
          </button>
        )}
      </div>
    </div>
  )
}
