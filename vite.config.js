import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const buildTime = new Date().toISOString()
const commitSha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.COMMIT_REF || process.env.GITHUB_SHA || 'local'
const appVersion = process.env.npm_package_version || '0.0.0'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_BUILD_VERSION': JSON.stringify(appVersion),
    'import.meta.env.VITE_BUILD_COMMIT': JSON.stringify(commitSha),
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(buildTime)
  }
})