import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { paths } from '@/router/constants'

type Path = (typeof paths)[keyof typeof paths]
type NavigationHistoryContextType = {
  history: string[]
  goBackToStep: (step: Path) => void
}

const NavigationHistoryContext = createContext<NavigationHistoryContextType>({
  history: [],
  goBackToStep: () => {},
})

export const NavigationHistoryProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [history, setHistory] = useState<string[]>([])
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setHistory((prev) => [...prev, location.pathname])
  }, [location])

  const goBackToStep = (step: Path) => {
    const stepIndex = history.lastIndexOf(step)
    if (stepIndex !== -1) {
      const stepsBack = history.length - 1 - stepIndex
      navigate(-stepsBack)
      setHistory((prev) => prev.slice(0, stepIndex + 1))
    } else {
      navigate(step)
    }
  }

  return (
    <NavigationHistoryContext.Provider value={{ history, goBackToStep }}>
      {children}
    </NavigationHistoryContext.Provider>
  )
}

export const useNavigationHistory = () => useContext(NavigationHistoryContext)
