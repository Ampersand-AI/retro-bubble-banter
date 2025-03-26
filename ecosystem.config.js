export default {
  apps: [
    {
      name: 'rovyk-frontend',
      script: 'npm',
      args: 'run preview',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'rovyk-backend',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        VITE_RESEND_API_KEY: process.env.VITE_RESEND_API_KEY
      }
    }
  ]
}; 