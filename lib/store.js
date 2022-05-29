import { useLayoutEffect } from 'react'
import create from 'zustand'
import createContext from 'zustand/context'

let store

const initialState = {
  lastUpdate: 0,
  userId: 109,
  syndicatesStore: [{ "value": 0, "label": "Select Syndicates" }],
  code: null,
  id: null,
  stripDate: null,
  show: true,
  keyErrorShow: true,  // Say that you cannot add a key that exists
  tagsStore: [],
  keyStore: [],
  categoryStore: [{ "id": 0, "name": "Select Codes" }],
}

const zustandContext = createContext()
export const Provider = zustandContext.Provider
// An example of how to get types
/** @type {import('zustand/index').UseStore<typeof initialState>} */
export const useStore = zustandContext.useStore

export const initializeStore = (preloadedState = {}) => {
  return create((set, get) => ({
    ...initialState,
    ...preloadedState,
    setId: (id) => { set({ id: id }) },
    setCode: (code) => { set({ code: code }) },
    setDate: (dt) => { set({ stripDate: dt }) },
    setShow: (show) => {set({show: show})},
    setShowKeyError: (keyErrorShow) => {set({keyErrorShow: keyErrorShow})},
    getTags: () => {
      return get().tagsStore
    },
    setTags: (data) => { set({ tagsStore: data }) },
    
    setSyndicates: (data) => { set({ syndicatesStore: data }) },
    setKeys: (data) => { set({ keyStore: data }) },
    setCategory: (data) => { set({ categoryStore: data }) },
  }))
}

export function useCreateStore(initialState) {
  if (typeof window === 'undefined') {
    return () => initializeStore(initialState)
  }
  store = store ?? initializeStore(initialState)
  useLayoutEffect(() => {
    if (initialState && store) {
      store.setState({
        ...store.getState(),
        ...initialState,
      })
    }
  }, [initialState])

  return () => store
}

