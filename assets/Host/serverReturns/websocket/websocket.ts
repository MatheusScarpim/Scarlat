// const socketIO = require('socket.io');
// const meuEmitter = require('../../server'); // Importe seu módulo meuEmitter

// const initSocket = (server) => {
//     const io = socketIO(server);
//     let numero;
//     io.on('connection', (socket) => {
//         console.log('Conectado...');

//         meuEmitter.meuEmitter.on('message', (message) => {
//             let numeroCerto = message.number.replace("@c.us", "")
//             if (numero == numeroCerto) {
//                 socket.broadcast.emit('message', message);
//             }
//         });

//         socket.on('sendmessage', (msg) => {
//             let numeroFormatado = msg.number + "@c.us"
//             meuEmitter.client.sendText(numeroFormatado, msg.message)
//         });

//         socket.on("sendnumber", (dados) => {
//             numero = dados.number;
//         });

//         meuEmitter.meuEmitter.on('protocolos', (protocolos) => {
//             socket.broadcast.emit('protocolos', protocolos);
//         });
//     });

//     return io;
// };

// module.exports = {
//     initSocket
// };