import {
    MongoClient,
    Db,
    Collection
} from 'mongodb';

const dbName = 'ScarlatDataBase';
const collections = ['PROTOCOLOS', 'MENSAGENS', 'SOLICITACAO_EMPRESTIMO', 'users'];
const url =
    'mongodb+srv://matheuscuan:334455@scarlatbot.85s8bhy.mongodb.net/?retryWrites=true&w=majority';

const clientOptions: any = {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    },
};

export interface ClientResult {
    client: MongoClient;
    db: Db;
}


export async function createCollectionIfNotExists(): Promise < void > {
    let client: MongoClient | undefined;

    try {
        client = await MongoClient.connect(url, clientOptions);
        const db = client.db(dbName);

        for (const collectionName of collections) {
            const existingCollections = await db.listCollections({
                name: collectionName
            }).toArray();

            if (existingCollections.length > 0) {
                console.log(`A coleção ${collectionName} já existe.`);
            } else {
                await db.createCollection(collectionName);
                console.log(`A coleção ${collectionName} foi criada com sucesso.`);
            }
        }
    } catch (error) {
        console.error('Erro ao conectar e criar a coleção:', error);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

export async function getClient(): Promise < Db > {
    try {
        const client = await MongoClient.connect(url, clientOptions);
        const db = client.db(dbName);

        setTimeout(() => {
            client.close()
        }, 5000);

        return db;
    } catch (error) {
        console.error('Erro ao obter o cliente:', error);
        throw error;
    }
}