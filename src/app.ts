import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './router';
const app = express();

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json()); //For Login body json, POST METHOD
app.use(express.urlencoded({ extended: true })); //For Login body json, POST METHOD
app.use(cors({
  origin: ['https://sdn2kalimati.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Sesuaikan dengan method yang kamu perlukan
  credentials: true
}));

app.use('/', router);

export default app;