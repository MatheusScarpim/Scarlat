const storagesADO = require('../storage.js');
// const geraProtocolo = require('../../DB/gerarProtocolos/geraProtocoloPrincipal.js');
// const geraProtocoloMSG = require('../../DB/gerarProtocolos/geraDadosProtocolo.js');

const initialStage = {
  exec({
    from,
    message,
    client
  }) {
    if (message && message != "" && message != undefined) {
      if (storagesADO.storage[from].protocolo) {
        setTimeout(() => {
          geraProtocoloMSG.CriarProtocoloMSG(storagesADO.storage[from].protocolo, message);
        }, 2000);
      } else {
        setTimeout(() => {
          let telnumber = from.replace("@c.us", "");
          geraProtocolo.CriarProtocoloPrincipal(telnumber)
            .then((nextId) => {
              storagesADO.storage[from].protocolo = nextId;
              storagesADO.storage[from].stage = 0;

              numProcotocolo = nextId;

              setTimeout(() => {
                geraProtocoloMSG.CriarProtocoloMSG(storagesADO.storage[from].protocolo, message);
              }, 1000);
            })
            .catch((error) => {
              console.error("Erro ao criar protocolo:", error);
            });
        }, 2000);
      }
    }
    return "";
  },
};


exports.initialStage = initialStage;