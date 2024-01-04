import express from 'express';
import http from 'http';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import path from 'path';

import userMensagemGet from '../api/requestGet';
import userMensagemPost from '../api/requestPost';
import ScarlatMeta from '../../modules/packages/meta_modules/WebHook/webhook';

const port: number = 8080;
const app = express();
const server: http.Server = http.createServer(app);

// Middleware
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', userMensagemGet);
app.use('/', userMensagemPost);
app.use('/', ScarlatMeta);

app.get('/status', (req, res) => {
  res.json({
    status: 'OK',
  });
});

server.listen(port, () => {
  console.log(`The app is running on port ${port}`);
});
