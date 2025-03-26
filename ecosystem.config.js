export default {
  apps: [
    {
      name: 'rovyk-app',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        VITE_RESEND_API_KEY: process.env.VITE_RESEND_API_KEY
      }
    }
  ]
}; 