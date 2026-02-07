import { useReducer, useEffect } from 'react'
import type { InvoiceData, InvoiceAction } from './types'

const STORAGE_KEY = 'invoiceful-data'

const defaultState: InvoiceData = {
  sender: { details: '' },
  client: { details: '' },
  invoiceNumber: '001',
  date: new Date().toISOString().split('T')[0],
  dueDate: '',
  currency: '$',
  locale: 'en-US',
  items: [{ id: crypto.randomUUID(), description: '', quantity: 1, rate: 0 }],
  taxRate: 0,
  notes: '',
}

const NUMERIC_FIELDS = new Set(['taxRate'])
const NUMERIC_ITEM_FIELDS = new Set(['quantity', 'rate'])

function safeNum(value: string | number): number {
  const n = Number(value)
  return Number.isNaN(n) ? 0 : Math.max(0, n)
}

function invoiceReducer(state: InvoiceData, action: InvoiceAction): InvoiceData {
  switch (action.type) {
    case 'UPDATE_SENDER':
      return { ...state, sender: { ...state.sender, ...action.payload } }
    case 'UPDATE_CLIENT':
      return { ...state, client: { ...state.client, ...action.payload } }
    case 'UPDATE_FIELD': {
      const { field, value } = action.payload
      const safeValue = NUMERIC_FIELDS.has(field) ? safeNum(value) : value
      return { ...state, [field]: safeValue }
    }
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, { id: crypto.randomUUID(), description: '', quantity: 1, rate: 0 }],
      }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) }
    case 'UPDATE_ITEM': {
      const { id, field, value } = action.payload
      const safeValue = NUMERIC_ITEM_FIELDS.has(field) ? safeNum(value) : value
      return {
        ...state,
        items: state.items.map((item) => (item.id === id ? { ...item, [field]: safeValue } : item)),
      }
    }
    case 'RESET':
      return {
        ...defaultState,
        items: [{ id: crypto.randomUUID(), description: '', quantity: 1, rate: 0 }],
      }
    default:
      return state
  }
}

export function useInvoiceState() {
  const [state, dispatch] = useReducer(invoiceReducer, defaultState, (initial) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  return { state, dispatch }
}
