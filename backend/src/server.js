import { createApp } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';

/** Local / long-running server entry point (`npm run dev`, `npm start`). */
await connectDb();
console.log('MongoDB connected');

const server = createApp().listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
