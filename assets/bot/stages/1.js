const storagesADO = require('../storage.js');
const geraProtocolo = require('../../DB/gerarProtocolos/geraProtocoloPrincipal.js');
const geraProtocoloMSG = require('../../DB/gerarProtocolos/geraDadosProtocolo.js');
const axios = require('axios');


const opStage = {
  exec({
    from,
    message,
    client
  }) {
    let params = storagesADO.storage[from].params;
    let mensagem = ""
    if ((storagesADO.storage[from].params.opcoes)) {
      setTimeout(() => {
        geraProtocoloMSG.CriarProtocoloMSG(storagesADO.storage[from].protocolo, message);
      }, 2000);
      let ops = storagesADO.storage[from].params.opcoes;
      let posArray = ops.find(opcao => opcao.id === message)
      if (posArray) {
        if (posArray.reply) {
          mensagem = (posArray.reply).toString()
        }
        let type = (posArray.type).toString();
        if (type == "CALLBACK") {
          typeCallback(posArray)
          geraProtocolo.AlteraStatusProtocolo(storagesADO.storage[from].protocolo, "F")
          storagesADO.storage[from].stage = 0;
        } else if (type == "TEXTO") {
          storagesADO.storage[from].stage = 0;
        } else if (type == "C" || type == "F") {
          geraProtocolo.AlteraStatusProtocolo(storagesADO.storage[from].protocolo, type);
          storagesADO.storage[from].stage = 0;
        } else {
          console.log("ERRO");
        }

        return mensagem;
      }
    }
    return `Desculpe, Não entendi\n\n${params.message}\n${params.opcoes.map((opcao) => `${opcao.id} - ${opcao.text}`).join("\n")}`;

  },
};

function typeCallback(posArray) {
  const url = posArray.callback;
  const method = posArray.method.toUpperCase();

  if (method === "GET" || method === "POST") {
    const axiosPromise = method === "GET" ?
      axios.get(url) :
      axios.post(url);

    axiosPromise.then((response) => {
      console.log("sucesso")
    }).catch((error) => {
      console.error('Erro na solicitação:', error);
      throw error;
    });
  } else {
    console.error("Método inválido:", method);
    return
  }
}



exports.opStage = opStage;