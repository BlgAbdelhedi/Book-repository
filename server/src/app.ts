import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { router as bookRouter } from './routes/bookRoutes';
import { router as authorRouter } from './routes/authorRoutes';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/books', bookRouter);
app.use('/api/authors', authorRouter);

app.use((err: any, req: any, res: any, next: any) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

export { app };
