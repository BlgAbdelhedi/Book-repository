import { app } from './app';
import { initDB } from './db';

const PORT = process.env.PORT || 4000;

async function start() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
});
