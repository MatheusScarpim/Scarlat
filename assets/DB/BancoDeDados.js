const { MongoClient, ServerApiVersion } = require('mongodb');
const dbName = 'ScarlatDataBase';



let collections = ["PROTOCOLOS", "MENSAGENS", "SOLICITACAO_EMPRESTIMO"]
const utl = "mongodb+srv://matheuscuan:334455@scarlatbot.85s8bhy.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const servidor = new MongoClient(utl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


servidor.connect(function (err) {
  if (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
    return;
  }
  console.log('Conexão estabelecida com sucesso.');
});

async function createCollectionIfNotExists() {

  try {
    const client = await servidor.connect();
    const db = client.db(dbName);

    collections.forEach(async (element) => {
      const collectionName = element;

      const collections = await db.listCollections({ name: collectionName }).toArray();

      if (collections.length > 0) {
        console.log(`A coleção ${collectionName} já existe.`);
      } else {
        await db.createCollection(collectionName);
        console.log(`A coleção ${collectionName} foi criada com sucesso.`);
      }
    });

    setTimeout(() => {
      client.close();
    }, 1000);

  } catch (err) {
    console.error('Erro ao conectar e criar a coleção:', err);
  }
}


createCollectionIfNotExists();

async function Client() {
  const client = await servidor.connect();
  return client;
}

module.exports = {
  Client
}