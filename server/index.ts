import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';


dotenv.config();


const app = express();
const port = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());


// Proxy middleware configuration
const anthropicProxy = createProxyMiddleware({
  target: 'https://api.anthropic.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/claude': '/v1/messages', // Rewrite path
  },
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader('x-api-key', process.env.VITE_ANTHROPIC_API_KEY || '');
    proxyReq.setHeader('anthropic-version', '2023-06-01');
  },
});


// Use the proxy for Claude API requests
app.use('/api/claude', anthropicProxy);


app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
