import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: { main: '#1565c0' },
  },
  typography: {
    h5: { fontWeight: 600 },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        outlined: {
          '&.MuiInputLabel-shrink': {
            backgroundColor: '#fff',
            paddingInline: 4,
            marginInlineStart: -4,
          },
        },
      },
    },
  },
})
