// db/mongodb.ts
import { MongoClient, MongoDBCollectionNamespace, ServerApiVersion } from 'mongodb';

const dbName = 'ScarlatDataBase';
const collections = ["PROTOCOLOS", "MENSAGENS", "SOLICITACAO_EMPRESTIMO"];
const url = "mongodb+srv://matheuscuan:334455@scarlatbot.85s8bhy.mongodb.net/?retryWrites=true&w=majority";

const server = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function createCollectionIfNotExists() {
    try {
        const client = await server.connect();
        const db = client.db(dbName);

        for (const element of collections) {
            const collectionName = element;

            const existingCollections = await db.listCollections({ name: collectionName }).toArray();

            if (existingCollections.length > 0) {
                console.log(`A coleção ${collectionName} já existe.`);
            } else {
                await db.createCollection(collectionName);
                console.log(`A coleção ${collectionName} foi criada com sucesso.`);
            }
        }

        setTimeout(() => {
            client.close();
        }, 1000);
    } catch (err) {
        console.error('Erro ao conectar e criar a coleção:', err);
    }
}

async function getClient() {
    let client : any = await server.connect();
    client
     = client.db(process.env.URL_MONGO)
    return client;
}

export {
    createCollectionIfNotExists,
    getClient,
};
