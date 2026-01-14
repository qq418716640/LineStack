import { createContext, useContext, ReactNode } from 'react'
import { useLineStackStore, LineStackStore } from './useStore'

const StoreContext = createContext<LineStackStore | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useLineStackStore()
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useStore(): LineStackStore {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within StoreProvider')
  }
  return context
}
