import express from 'express';
import cors from 'cors';
import { env } from './lib/env.js';
import { authMiddleware } from './middleware/auth.js';
import { buildApiRouter } from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Attach auth context (OIDC JWT verification or dev header)
app.use(authMiddleware);

app.use('/api', buildApiRouter());

app.listen(env.PORT, () => {
  console.log(`[nutri-api] listening on :${env.PORT}`);
});
