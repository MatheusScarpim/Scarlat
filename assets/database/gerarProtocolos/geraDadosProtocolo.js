//Scarpim: Id do protocolo (puxar da principal), mensagem enviada,data de envio,ordem
// const criarConexao = require('../BancoDeDados');
const moment = require('moment-timezone');
const gerarProtocolos = require('../gerarProtocolos/geraProtocoloPrincipal');
const storagesADO = require('../../bot/storage');

async function CriarProtocoloMSG(id, msg) {
  try {
    console.log(`CriarProtocoloMSG`);
    const dataAtualFormatada = moment.tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
    const client = await criarConexao.Client();
    const db = client.db('ScarlatDataBase');
    const collection = db.collection('MENSAGENS');

    // Encontrar o último valor de ORDEM para o mesmo PROTOCOLO_ID
    const lastOrdem = await collection.findOne({
      PROTOCOLO_ID: id
    }, {
      sort: {
        ORDEM: -1
      }
    });
    const nextOrdem = lastOrdem ? lastOrdem.ORDEM + 1 : 1;

    const lastid = await collection.findOne({}, {
      sort: {
        _id: -1
      }
    });
    const nextid = lastid ? lastid._id + 1 : 1;

    await collection.insertOne({
      _id: nextid,
      PROTOCOLO_ID: id,
      MENSAGEM: msg,
      DATA_ENVIO: dataAtualFormatada,
      ORDEM: nextOrdem,
      USUARIO: "U",
      LIDA: "false"
    });

    client.close();
    await gerarProtocolos.UpdateUltimoContrato(id);

    const delayMilliseconds = 1000; // 1 segundo
    await new Promise((resolve) => setTimeout(resolve, delayMilliseconds));

    // Continuar com o resto do código após o atraso
    // ...
  } catch (error) {
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
        return CriarProtocoloMSG(id, msg);
      } else {
        console.error('Erro ao conectar e inserir documentos:', error);
      }
    } else {
      console.error('Erro ao conectar e inserir documentos:', error);
    }
  }
}



async function CriarProtocoloMSGBot(id, msg) {
  try {
    console.log(`CriarProtocoloMSGBot`);
    const dataAtualFormatada = moment.tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
    const client = await criarConexao.Client();
    const db = client.db('ScarlatDataBase');
    const collection = db.collection('MENSAGENS');

    // Encontrar o último valor de ORDEM para o mesmo PROTOCOLO_ID
    const lastOrdem = await collection.findOne({
      PROTOCOLO_ID: id
    }, {
      sort: {
        ORDEM: -1
      }
    });
    const nextOrdem = lastOrdem ? lastOrdem.ORDEM + 1 : 1;

    const lastid = await collection.findOne({}, {
      sort: {
        _id: -1
      }
    });
    const nextid = lastid ? lastid._id + 1 : 1;
    await collection.insertOne({
      _id: nextid,
      PROTOCOLO_ID: id,
      MENSAGEM: msg,
      DATA_ENVIO: dataAtualFormatada,
      ORDEM: nextOrdem,
      USUARIO: "B",
      LIDA: "true"
    });
    client.close();
    await gerarProtocolos.UpdateUltimoContrato(id);

    const delayMilliseconds = 1000; // 1 segundo
    await new Promise((resolve) => setTimeout(resolve, delayMilliseconds));

    // Continuar com o resto do código após o atraso
    // ...
  } catch (error) {
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
        return CriarProtocoloMSGBot(id, msg);
      } else {
        console.error('Erro ao conectar e inserir documentos:', error);
      }
    } else {
      console.error('Erro ao conectar e inserir documentos:', error);
    }
  }
}

async function gravaMensagem(numero) {
  try {
    // Formatar o número para o formato desejado (remover @c.us e adicionar os parênteses, espaço e hífen)
    const numeroFormatado = formatarNumero(numero);

    const client = await criarConexao.Client();
    const db = client.db('ScarlatDataBase');
    const collection = db.collection('MENSAGENS');

    // Utilizando uma expressão regular para encontrar o número no formato desejado
    const regexNumero = new RegExp(`^${numeroFormatado}$`, 'i');
    // Encontrar o último valor de ORDEM para o número formatado
    const lastOrdem = await collection.findOne({
      USUARIO: "U",
      MENSAGEM: regexNumero
    }, {
      sort: {
        ORDEM: -1
      }
    });

    client.close();

    return lastOrdem ? lastOrdem.ORDEM : null;
  } catch (error) {
    console.error('Erro ao conectar e consultar documentos:', error);
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
        return gravaMensagem(numero);
      } else {
        console.error('Erro ao conectar e inserir dados do Usuario:', error);
      }
    } else {
      console.error('Erro ao conectar e inserir dados do Usuario:', error);
    }
    return null;
  }
}

function formatarNumero(numeroOriginal) {
  // Extrair apenas os dígitos do número original
  const numeros = numeroOriginal.match(/\d/g).join('');

  // Formatar para (XX) XXXXX-XXXX
  return `(${numeros.substring(2, 3)}) ${numeros.substring(4, 8)}-${numeros.substring(8)}`;
}

function AlterarStatusPrincipal(id, status) {
  gerarProtocolos.AlteraStatusProtocolo(id, status);
}


exports.CriarProtocoloMSG = CriarProtocoloMSG;
exports.AlterarStatusPrincipal = AlterarStatusPrincipal;
exports.CriarProtocoloMSGBot = CriarProtocoloMSGBot;
exports.gravaMensagem = gravaMensagem;