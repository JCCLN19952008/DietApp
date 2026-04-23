import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db';
import routes from './routes';
 
dotenv.config();
 
const app = express();
const PORT = process.env.PORT || 3001;
 
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
 
app.use('/api', routes);
 
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
 
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🥗  Dietetics API running → http://localhost:${PORT}`);
    console.log(`    Health:  http://localhost:${PORT}/health`);
    console.log(`    Ping:    http://localhost:${PORT}/api/ping\n`);
  });
}).catch(err => {
  console.error('Failed to initialise database:', err);
  process.exit(1);
});
 