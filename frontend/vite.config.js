import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        adminLogin: resolve(import.meta.dirname, 'admin-login.html'),
        trainerLogin: resolve(import.meta.dirname, 'trainer-login.html'),
        traineeLogin: resolve(import.meta.dirname, 'trainee-login.html'),
        adminDashboard: resolve(import.meta.dirname, 'admin-dashboard.html'),
        trainerDashboard: resolve(import.meta.dirname, 'trainer-dashboard.html'),
        traineeDashboard: resolve(import.meta.dirname, 'trainee-dashboard.html')
      }
    }
  }
})
