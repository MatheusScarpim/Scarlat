import express from 'express';
import http from 'http';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import path from 'path';

import {
  createCollectionIfNotExists
} from "../../assets/database/dataBase"

import userMensagemGet from '../api/routes/requestGet';
import userMensagemPost from '../api/routes/requestPost';
import ScarlatMeta from '../../modules/Packages/meta_modules/WebHook/webhook';
import Auth from '../auth/routes/authRoutes';
import {
  authenticateToken
} from '../auth/middleware/middlewareAuth';


const port: number = 8080;
const app = express();
const server: http.Server = http.createServer(app);

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/status', (req, res) => {
  res.json({
    status: 'OK',
  });
});

app.use('/', Auth);
app.use('/', ScarlatMeta);

app.use('/', authenticateToken);
app.use('/', userMensagemGet);
app.use('/', userMensagemPost);

createCollectionIfNotExists()

server.listen(port, () => {
  console.log(`The app is running on port ${port}`);
});