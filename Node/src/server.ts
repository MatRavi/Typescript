import 'express-async-errors';
import 'dotenv/config';
import express from 'express';
import { routes } from './routes/';
import { ErrorInterceptor } from './Error/ErrorInterceptor';

const app = express();

app.use(express.json());
app.use(routes);

app.use(ErrorInterceptor);

app.listen(3333, () => {
  console.log('Server OK! 3333');
});
