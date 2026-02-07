import { execSync } from 'child_process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

let commitHash = 'dev'
try {
  commitHash = execSync('git rev-parse --short HEAD').toString().trim()
} catch { /* not in a git repo */ }

export default defineConfig({
  plugins: [react()],
  base: '/invoiceful/',
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
})
