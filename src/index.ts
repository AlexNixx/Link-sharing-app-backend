import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import path from 'path';
import * as dotenv from 'dotenv';
import errorMiddleware from './middlewares/error-middleware.js';
import router from './router/index.js';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser());

app.use(cors({ credentials: true, origin: `${process.env.CLIENT_URL}` }));

app.use(express.static(path.resolve(__dirname, '/build', 'static')));
app.use(fileUpload({}));

app.use('/api', router);

app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL!);
        console.log('Mongo Connected!');
        app.listen(process.env.PORT || 5000, () => console.log(`Server work on port: ${process.env.PORT}`));
    } catch (error) {
        console.log(error);
    }
};

start().then(() => {
    console.log('Server started successfully');
});
