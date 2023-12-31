const express = require('express');
const http = require('http');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');


const ScarlatMeta = require("../../modules/meta_modules/WebHook/webhook")

const userRouteToken = require('../Api/requestToken');
const userMensagemGet = require('../Api/requestGet');
const userMensagemPost = require('../Api/requestPost');
// const socketModule = require('../ServerReturn/websocket/websocket');


const chat = require('../pages/chat/chat');

app.use('/', userRouteToken);
app.use('/', userMensagemGet);
app.use('/', userMensagemPost);
app.use('/', chat);
app.use('/', ScarlatMeta)

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname + "/public")));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/status', (req, res) => {
  res.json({
    "status": "OK"
  });
});

const port = process.env.PORT || 8080;
const server = http.createServer(app);

// const socketIO = require('socket.io')
// const io = socketModule.initSocket(server);

server.listen(port, function () {
  console.log('O app está rodando ' + port);
});

// Exporte todos os módulos em um único objeto
module.exports = {
  userRouteToken: userRouteToken,
  userMensagemGet: userMensagemGet,
  userMensagemPost: userMensagemPost,
  chat: chat
};