const criarConexao = require('../BancoDeDados.js');
const moment = require('moment-timezone');
// const clientInstance = require('../../../../server.js');
const axios = require('axios');

let cachedClient = null;
let cachedDb = null;
let entradaCount = 0;
const MAX_ENTRADAS = 10; // Defina o número máximo de entradas antes de fechar e reabrir a conexão

async function obterCliente() {
    console.log(entradaCount);
    try {
        if (!cachedClient || !cachedClient.db) {
            console.warn("Cliente não está conectado, tentando reconectar...");
            cachedClient = await criarConexao.Client();
            cachedDb = cachedClient.db('ScarlatDataBase');
        }
        return cachedDb;
    } catch (error) {
        console.error("Erro ao obter cliente:", error);
        throw error;
    }
}



async function CriarProtocoloPrincipal(numero) {
    try {
        console.log(`CriarProtocoloPrincipal`);
        const dataAtualFormatada = moment.tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
        const Nome = await clientInstance.client.getChatById(numero + "@c.us");
        let nomeWhatsapp = Nome.contact.pushname;
        const Foto = await clientInstance.client.getProfilePicFromServer(numero + "@c.us");
        // Uso da função
        let foto = "";
        if (Foto.tag != null) {
            await imageUrlToBase64(Foto.imgFull)
                .then(base64String => foto = base64String)
                .catch(error => console.error('Erro ao converter imagem para base64:', error));
        } else {
            foto = null;
        }
        const db = await obterCliente();
        const collection = db.collection('PROTOCOLOS');

        const lastDocument = await collection.findOne({}, {
            sort: {
                _id: -1
            }
        });
        const nextId = lastDocument ? lastDocument._id + 1 : 1;

        await collection.insertOne({
            _id: nextId,
            NUMERO: numero,
            DATA_CRIACAO: dataAtualFormatada,
            ULTIMO_CONTATO: dataAtualFormatada,
            NOME: nomeWhatsapp,
            FOTOPERFIL: foto,
            STATUS: "A",
        });

        entradaCount++;

        if (entradaCount >= MAX_ENTRADAS) {
            entradaCount = 0;
            await cachedClient.close();
            cachedClient = null;
            cachedDb = null;
        }

        return nextId;
    } catch (error) {
        // Lida com o erro relacionado à conexão fechada ou expirada
        console.log(error);
        if (
            error.message &&
            (error.message.includes('closed') || error.message.includes('Client must be connected') || error.message.includes('duplicate key') || error.message.includes('Cannot use a session that has ended'))
        ) {
            console.warn('Conexão fechada, expirada ou não conectada. Tentando novamente...');
            cachedClient = await criarConexao.Client();
            cachedDb = cachedClient.db('ScarlatDataBase');
            if (entradaCount < MAX_ENTRADAS) {
                return CriarProtocoloPrincipal(numero);
            } else {
                console.error('Erro ao conectar e inserir documentos:', error);
            }
        } else {
            console.error('Erro ao conectar e inserir documentos:', error);
        }
    }
}

async function UpdateUltimoContrato(id) {
    try {
        console.log(`UpdateUltimoContrato`);
        const dataAtualFormatada = moment.tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');

        const db = await obterCliente();
        const collection = db.collection('PROTOCOLOS');

        await collection.updateOne({
            _id: id
        }, {
            $set: {
                ULTIMO_CONTATO: dataAtualFormatada
            }
        });
    } catch (error) {
        // Lida com o erro relacionado à conexão fechada ou expirada
        if (
            error.message &&
            (error.message.includes('closed') || error.message.includes('Client must be connected') || error.message.includes('duplicate key') || error.message.includes('Cannot use a session that has ended'))
        ) {
            console.warn('Conexão fechada, expirada ou não conectada. Tentando novamente...');
            // Tenta obter uma nova conexão
            cachedClient = await criarConexao.Client();
            cachedDb = cachedClient.db('ScarlatDataBase');
            // Recurso para evitar um loop infinito
            if (entradaCount < MAX_ENTRADAS) {
                return UpdateUltimoContrato(id);
            } else {
                console.error('Erro ao conectar e inserir documentos:', error);
            }
        } else {
            console.error('Erro ao conectar e inserir documentos:', error);
        }
    }
}

async function AlteraStatusProtocolo(id, status) {
    try {
        console.log(`AlteraStatusProtocolo`);
        const db = await obterCliente();
        const collection = db.collection('PROTOCOLOS');

        await collection.updateOne({
            _id: id
        }, {
            $set: {
                STATUS: status
            }
        });
    } catch (error) {
        // Lida com o erro relacionado à conexão fechada ou expirada
        if (
            error.message &&
            (error.message.includes('closed') || error.message.includes('Client must be connected') || error.message.includes('duplicate key') || error.message.includes('Cannot use a session that has ended'))
        ) {
            console.warn('Conexão fechada, expirada ou não conectada. Tentando novamente...');
            // Tenta obter uma nova conexão
            cachedClient = await criarConexao.Client();
            cachedDb = cachedClient.db('ScarlatDataBase');
            // Recurso para evitar um loop infinito
            if (entradaCount < MAX_ENTRADAS) {
                return AlteraStatusProtocolo(id, status);
            } else {
                console.error('Erro ao conectar e inserir documentos:', error);
            }
        } else {
            console.error('Erro ao conectar e inserir documentos:', error);
        }
    }
}

async function imageUrlToBase64(url) {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });
        const buffer = Buffer.from(response.data, 'binary');
        const base64String = buffer.toString('base64');
        return base64String;
    } catch (error) {
        throw new Error('Erro ao converter imagem para base64: ' + error.message);
    }
}

exports.UpdateUltimoContrato = UpdateUltimoContrato;
exports.CriarProtocoloPrincipal = CriarProtocoloPrincipal;
exports.AlteraStatusProtocolo = AlteraStatusProtocolo;