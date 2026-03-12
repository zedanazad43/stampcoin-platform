import "dotenv/config";
import express from "express";
import { createServer } from "http";

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Configure body parser
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Status endpoint
  app.get('/api/status', (req, res) => {
    res.json({ success: true, status: 'running' });
  });

  // Transaction endpoint
  app.post('/api/transaction', (req, res) => {
    const { amount, currency, recipient, sender } = req.body;
    res.json({
      success: true,
      transaction: {
        id: Math.random().toString(36).substr(2, 9),
        amount,
        currency,
        recipient,
        sender,
        timestamp: new Date().toISOString(),
        status: 'created'
      }
    });
  });

  // Get transactions endpoint
  app.get('/api/transactions', (req, res) => {
    res.json({
      success: true,
      transactions: []
    });
  });

  // Serve static files (frontend)
  app.use(express.static('public'));

  // Serve index.html for all other routes (SPA fallback)
  app.get('*', (req, res) => {
    res.sendFile(new URL('./public/index.html', import.meta.url).pathname, { root: process.cwd() });
  });

  const port = parseInt(process.env.PORT || "8080", 10);

  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${port}/`);
  });
}

startServer().catch(console.error);
