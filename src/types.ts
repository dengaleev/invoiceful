export interface ContactInfo {
  details: string
}

export interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
}

export interface InvoiceData {
  sender: ContactInfo
  client: ContactInfo
  invoiceNumber: string
  date: string
  dueDate: string
  currency: string
  locale: string
  items: LineItem[]
  taxRate: number
  notes: string
}

export type InvoiceAction =
  | { type: 'UPDATE_SENDER'; payload: Partial<ContactInfo> }
  | { type: 'UPDATE_CLIENT'; payload: Partial<ContactInfo> }
  | { type: 'UPDATE_FIELD'; payload: { field: string; value: string | number } }
  | { type: 'ADD_ITEM' }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_ITEM'; payload: { id: string; field: string; value: string | number } }
  | { type: 'RESET' }
