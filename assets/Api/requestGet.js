const express = require('express');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const bodyParser = require('body-parser');
const multer = require('multer');



const router = express.Router();

router.use(bodyParser.json({
    limit: '50mb'
}));


router.post('/webhookteste', retornaWebhook);
// router.post('/protocolos', retornaWebhookProtocolos);


function retornaWebhook(req, res) {}

function retornaWebhookProtocolos(req, res) {
    meuEmitter.meuEmitter.emit("protocolos", req.body)
}



module.exports = router;