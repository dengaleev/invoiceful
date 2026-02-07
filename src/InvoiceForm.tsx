import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Add, Delete } from '@mui/icons-material'
import type { InvoiceData, InvoiceAction } from './types'
import { formatAmount, formatDate } from './utils'

interface Props {
  state: InvoiceData
  dispatch: React.Dispatch<InvoiceAction>
}

export default function InvoiceForm({ state, dispatch }: Props) {
  const subtotal = state.items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  const taxAmount = subtotal * (state.taxRate / 100)
  const total = subtotal + taxAmount
  const fmt = (n: number) => formatAmount(n, state.currency, state.locale)
  const fmtDate = (iso: string) => formatDate(iso, state.locale)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Sender & Client */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            multiline
            minRows={5}
            label="From"
            placeholder={"Company Name\nTax ID: 123456\nAddress: ...\nEmail: ..."}
            value={state.sender.details}
            onChange={(e) => dispatch({ type: 'UPDATE_SENDER', payload: { details: e.target.value } })}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            multiline
            minRows={5}
            label="Bill To"
            placeholder={"Client Name\nTax ID: 123456\nAddress: ...\nEmail: ..."}
            value={state.client.details}
            onChange={(e) => dispatch({ type: 'UPDATE_CLIENT', payload: { details: e.target.value } })}
          />
        </Grid>
      </Grid>

      {/* Invoice Details */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Invoice #"
              value={state.invoiceNumber}
              onChange={(e) => dispatch({ type: 'UPDATE_FIELD', payload: { field: 'invoiceNumber', value: e.target.value } })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Date"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={state.date}
              onChange={(e) => dispatch({ type: 'UPDATE_FIELD', payload: { field: 'date', value: e.target.value } })}
              helperText={fmtDate(state.date)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Due Date"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={state.dueDate}
              onChange={(e) => dispatch({ type: 'UPDATE_FIELD', payload: { field: 'dueDate', value: e.target.value } })}
              helperText={fmtDate(state.dueDate)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Line Items */}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell align="right" sx={{ width: 100 }}>Qty</TableCell>
              <TableCell align="right" sx={{ width: 120 }}>Rate</TableCell>
              <TableCell align="right" sx={{ width: 120 }}>Amount</TableCell>
              <TableCell sx={{ width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {state.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_ITEM', payload: { id: item.id, field: 'description', value: e.target.value } })
                    }
                  />
                </TableCell>
                <TableCell align="right">
                  <TextField
                    size="small"
                    variant="standard"
                    type="number"
                    inputProps={{ min: 0, style: { textAlign: 'right' } }}
                    value={item.quantity}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_ITEM', payload: { id: item.id, field: 'quantity', value: Number(e.target.value) } })
                    }
                    sx={{ width: 80 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <TextField
                    size="small"
                    variant="standard"
                    type="number"
                    inputProps={{ min: 0, step: 0.01, style: { textAlign: 'right' } }}
                    value={item.rate}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_ITEM', payload: { id: item.id, field: 'rate', value: Number(e.target.value) } })
                    }
                    sx={{ width: 100 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">{fmt(item.quantity * item.rate)}</Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                    disabled={state.items.length === 1}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ p: 1 }}>
          <Button size="small" startIcon={<Add />} onClick={() => dispatch({ type: 'ADD_ITEM' })}>
            Add Item
          </Button>
        </Box>
      </TableContainer>

      {/* Totals & Tax */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box sx={{ width: 280 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Subtotal</Typography>
            <Typography variant="body2">{fmt(subtotal)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2">Tax</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                size="small"
                variant="standard"
                type="number"
                inputProps={{ min: 0, step: 0.1, style: { textAlign: 'right', width: 50 } }}
                value={state.taxRate}
                onChange={(e) =>
                  dispatch({ type: 'UPDATE_FIELD', payload: { field: 'taxRate', value: Number(e.target.value) } })
                }
              />
              <Typography variant="body2">%</Typography>
              <Typography variant="body2" sx={{ ml: 1 }}>{fmt(taxAmount)}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '2px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight={600}>Total</Typography>
            <Typography variant="subtitle1" fontWeight={600}>{fmt(total)}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Notes */}
      <TextField
        fullWidth
        multiline
        minRows={2}
        size="small"
        label="Notes"
        placeholder="Payment terms, bank details, etc."
        value={state.notes}
        onChange={(e) => dispatch({ type: 'UPDATE_FIELD', payload: { field: 'notes', value: e.target.value } })}
      />
    </Box>
  )
}
