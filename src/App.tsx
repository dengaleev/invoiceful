import { useCallback, useState } from 'react'
import { Box, Button, Container, Link, MenuItem, Paper, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { pdf } from '@react-pdf/renderer'
import { Download, GitHub, RestartAlt } from '@mui/icons-material'
import InvoiceForm from './InvoiceForm'
import InvoicePDF from './InvoicePDF'
import { useInvoiceState } from './useInvoiceState'

const CURRENCIES = ['$', '\u20AC', '\u00A3', '\u00A5', '\u20BD', '\u20BE', 'CHF', 'CAD', 'AUD']
const LOCALES = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'de-DE', label: 'Deutsch' },
  { value: 'fr-FR', label: 'Fran\u00E7ais' },
  { value: 'ru-RU', label: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439' },
  { value: 'ka-GE', label: '\u10E5\u10D0\u10E0\u10D7\u10E3\u10DA\u10D8' },
  { value: 'ja-JP', label: '\u65E5\u672C\u8A9E' },
  { value: 'zh-CN', label: '\u4E2D\u6587' },
]

export default function App() {
  const { state, dispatch } = useInvoiceState()
  const [generating, setGenerating] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleDownload = useCallback(async () => {
    setGenerating(true)
    try {
      const blob = await pdf(<InvoicePDF data={state} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${state.invoiceNumber || 'draft'}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setGenerating(false)
    }
  }, [state])

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
      }}>
        <Typography variant="h5" component="h1">Invoiceful</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={isMobile ? undefined : <RestartAlt />}
            onClick={() => dispatch({ type: 'RESET' })}
          >
            {isMobile ? <RestartAlt /> : 'Reset'}
          </Button>
          <Button
            variant="contained"
            size={isMobile ? 'small' : 'medium'}
            startIcon={<Download />}
            disabled={generating}
            onClick={handleDownload}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {generating ? 'Generating...' : 'Download PDF'}
          </Button>
        </Box>
      </Box>

      {/* Settings */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: { xs: 0, sm: 1 } }}>Settings</Typography>
        <TextField
          size="small"
          select
          label="Currency"
          value={state.currency}
          onChange={(e) => dispatch({ type: 'UPDATE_FIELD', payload: { field: 'currency', value: e.target.value } })}
          sx={{ width: 100 }}
        >
          {CURRENCIES.map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          select
          label="Locale"
          value={state.locale}
          onChange={(e) => dispatch({ type: 'UPDATE_FIELD', payload: { field: 'locale', value: e.target.value } })}
          sx={{ width: 150 }}
        >
          {LOCALES.map((l) => (
            <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>
          ))}
        </TextField>
      </Paper>
      <InvoiceForm state={state} dispatch={dispatch} />
      <Box component="footer" sx={{ mt: 4, py: 2, textAlign: 'center' }}>
        <Link
          href={`https://github.com/dengaleev/invoiceful/commit/${__COMMIT_HASH__}`}
          target="_blank"
          rel="noopener"
          color="text.secondary"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontSize: 12 }}
        >
          <GitHub sx={{ fontSize: 14 }} />
          {__COMMIT_HASH__.slice(0, 7)}
        </Link>
      </Box>
    </Container>
  )
}
