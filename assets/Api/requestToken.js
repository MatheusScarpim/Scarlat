var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

router.get('/token', function (req, res) {
    var test = req.headers;
    if (test.username === "adm" && test.senha === "adm") {
        var token = jwt.sign({ username: 'adm', senha: "adm" }, 'supersecret', { expiresIn: 120 });
        res.json({
            "Token": token
        });
    } else if (test.username === "NexumWhat" && test.senha === "Nexum@2022") {
        var token = jwt.sign({ username: 'NexumWhat', senha: "Nexum@2022" }, 'supersecret', { expiresIn: 120 });
        res.json({
            "Token": token
        });
    } else {
        res.send("ERRO");
    }
})

module.exports = router;
