import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import type { InvoiceData } from './types'
import { formatAmount, formatDate } from './utils'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#333' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1565c0', marginBottom: 4 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', marginBottom: 6, color: '#555' },
  contactBlock: { marginBottom: 20 },
  text: { marginBottom: 2 },
  row: { flexDirection: 'row' },
  detailLabel: { width: 55, fontWeight: 'bold', color: '#555' },
  detailValue: { flex: 1 },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#1565c0',
    paddingBottom: 4,
    marginBottom: 4,
    fontWeight: 'bold',
    fontSize: 9,
    color: '#555',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 5,
  },
  colDesc: { width: '50%' },
  colQty: { width: '15%', textAlign: 'right' },
  colRate: { width: '15%', textAlign: 'right' },
  colAmount: { width: '20%', textAlign: 'right' },
  totalsContainer: { marginTop: 16, alignItems: 'flex-end' },
  totalsRow: { flexDirection: 'row', width: 200, justifyContent: 'space-between', marginBottom: 4 },
  totalFinal: {
    flexDirection: 'row',
    width: 200,
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: '#333',
    paddingTop: 4,
    marginTop: 4,
  },
  totalLabel: { fontWeight: 'bold', fontSize: 12 },
  totalValue: { fontWeight: 'bold', fontSize: 12 },
  notes: { marginTop: 30, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
})

export default function InvoicePDF({ data }: { data: InvoiceData }) {
  const subtotal = data.items.reduce((s, i) => s + i.quantity * i.rate, 0)
  const taxAmount = subtotal * (data.taxRate / 100)
  const total = subtotal + taxAmount
  const fmt = (n: number) => formatAmount(n, data.currency, data.locale)
  const fmtDate = (iso: string) => formatDate(iso, data.locale, '—')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: '55%' }}>
            <Text style={styles.title}>INVOICE</Text>
            {data.sender.details && <Text style={styles.text}>{data.sender.details}</Text>}
          </View>
          <View style={{ width: '35%' }}>
            <View style={[styles.row, { marginBottom: 2 }]}>
              <Text style={styles.detailLabel}>Invoice #</Text>
              <Text style={styles.detailValue}>{data.invoiceNumber || '—'}</Text>
            </View>
            <View style={[styles.row, { marginBottom: 2 }]}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{fmtDate(data.date)}</Text>
            </View>
            {data.dueDate && (
              <View style={styles.row}>
                <Text style={styles.detailLabel}>Due Date</Text>
                <Text style={styles.detailValue}>{fmtDate(data.dueDate)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Bill To */}
        <View style={styles.contactBlock}>
          <Text style={styles.sectionTitle}>BILL TO</Text>
          {data.client.details && <Text style={styles.text}>{data.client.details}</Text>}
        </View>

        {/* Items Table */}
        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>Description</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colRate}>Rate</Text>
          <Text style={styles.colAmount}>Amount</Text>
        </View>
        {data.items.map((item) => (
          <View style={styles.tableRow} key={item.id}>
            <Text style={styles.colDesc}>{item.description || '—'}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colRate}>{fmt(item.rate)}</Text>
            <Text style={styles.colAmount}>{fmt(item.quantity * item.rate)}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsRow}>
            <Text>Subtotal</Text>
            <Text>{fmt(subtotal)}</Text>
          </View>
          {data.taxRate > 0 && (
            <View style={styles.totalsRow}>
              <Text>Tax ({data.taxRate}%)</Text>
              <Text>{fmt(taxAmount)}</Text>
            </View>
          )}
          <View style={styles.totalFinal}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{fmt(total)}</Text>
          </View>
        </View>

        {/* Notes */}
        {data.notes && (
          <View style={styles.notes}>
            <Text style={styles.sectionTitle}>NOTES</Text>
            <Text>{data.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}
