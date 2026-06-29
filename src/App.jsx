import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Dossiers from './pages/Dossiers.jsx'
import NewDossier from './pages/NewDossier.jsx'
import Audit from './pages/Audit.jsx'
import Lifecycle from './pages/Lifecycle.jsx'
import Compliance from './pages/Compliance.jsx'
import Integrations from './pages/Integrations.jsx'

const ONBOARDING_STEPS = [
  {
    title: 'Добро пожаловать в RegMed!',
    text: 'Платформа для управления досье на регистрацию медицинских изделий. Давайте познакомимся с основными функциями.',
    position: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  },
  {
    title: 'Навигация',
    text: 'В боковой панели находятся все разделы платформы: дашборд, список досье, создание нового досье, аудит и многое другое.',
    position: { top: '50%', left: '280px', transform: 'translateY(-50%)' },
  },
  {
    title: 'Аудит документов',
    text: 'ИИ-аудит проверяет ваши документы на соответствие ЕАЭС 2017/28, ГОСТ Р и требованиям Росздравнадзора. Каждое замечание содержит конкретные предложения по исправлению.',
    position: { top: '50%', left: '280px', transform: 'translateY(-50%)' },
  },
  {
    title: 'Прогноз регистрации',
    text: 'В разделе "Комплаенс & прогнозы" вы можете рассчитать ориентировочные сроки регистрации для вашего типа изделия и класса риска.',
    position: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  },
]

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [filters, setFilters] = useState({})
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [showOnboarding, setShowOnboarding] = useState(true)

  // Check if first load
  useEffect(() => {
    const seen = localStorage.getItem('regmed_onboarding_seen')
    if (seen) setShowOnboarding(false)
  }, [])

  const dismissOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem('regmed_onboarding_seen', '1')
  }

  const nextOnboarding = () => {
    if (onboardingStep < ONBOARDING_STEPS.length - 1) {
      setOnboardingStep(s => s + 1)
    } else {
      dismissOnboarding()
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard setCurrentPage={setCurrentPage} />
      case 'dossiers':
        return <Dossiers setCurrentPage={setCurrentPage} filters={filters} setFilters={setFilters} />
      case 'new-dossier':
        return <NewDossier setCurrentPage={setCurrentPage} />
      case 'audit':
        return <Audit />
      case 'lifecycle':
        return <Lifecycle />
      case 'compliance':
        return <Compliance />
      case 'integrations':
        return <Integrations />
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />
    }
  }

  const step = ONBOARDING_STEPS[onboardingStep]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0F172A' }}>
      {/* Onboarding overlay */}
      {showOnboarding && (
        <>
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 10000,
            pointerEvents: 'all',
          }} onClick={dismissOnboarding} />
          <div style={{
            position: 'fixed',
            ...step.position,
            background: '#1E293B',
            border: '2px solid #9966FF',
            borderRadius: '16px',
            padding: '24px',
            width: '360px',
            zIndex: 10001,
            boxShadow: '0 25px 80px rgba(0,0,0,0.8), 0 0 0 1px #9966FF40',
          }} onClick={e => e.stopPropagation()}>
            {/* Step dots */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
              {ONBOARDING_STEPS.map((_, i) => (
                <div key={i} style={{
                  width: i === onboardingStep ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i === onboardingStep ? '#9966FF' : '#334155',
                  transition: 'all 0.3s',
                }}/>
              ))}
            </div>

            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#9966FF1A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              color: '#9966FF',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#F1F5F9', margin: '0 0 10px' }}>
              {step.title}
            </h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.6', margin: '0 0 20px' }}>
              {step.text}
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={dismissOnboarding}
                style={{
                  background: 'none',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '9px 16px',
                  fontSize: '13px',
                  color: '#64748B',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >Пропустить</button>
              <button
                onClick={nextOnboarding}
                style={{
                  flex: 1,
                  background: '#9966FF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 16px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {onboardingStep < ONBOARDING_STEPS.length - 1 ? 'Следующий →' : 'Начать работу'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Sidebar */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Main content */}
      <div style={{
        marginLeft: '260px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        <Header currentPage={currentPage} />

        <main style={{
          marginTop: '64px',
          padding: '24px',
          flex: 1,
          overflowY: 'auto',
          height: 'calc(100vh - 64px)',
        }}>
          <div className="fade-in" key={currentPage}>
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  )
}
