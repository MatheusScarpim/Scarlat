import {
    getClient,
    ClientResult
} from "../../assets/database/dataBase";

import {
    BSON,
    ObjectId,
    UUID
} from "mongodb"

const options: any = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo'
};

interface Message {
    _id: any;
    identifier: string;
    conversationId ? : any;
    dateMessage ? : Date;
    firstContact: string;
    name: string;
    operatorId ? : string | null;
    status ? : string;
    provider: string;
    type ? : string;
    read ? : boolean;
    message ? : string;
    lastMessage ? : any;
    photo ? : any;
    dateCreated ? : any;
}


export function conversatioExisting(message: Message, to: string): Promise < any > {
    return new Promise(async (resolve, reject) => {
        try {
            const existingId: any = await getExisting(message.conversationId);

            if (existingId) {
                resolve(await addMessageUser(message, to, true));
            } else {
                resolve({
                    status: "error",
                    message: "Not conversationId existing or its is finished"
                });
            }
        } catch (error) {
            console.error("Error in conversatioExisting function:", error);
            reject(error);
        }
    });
}

async function generateId(message: Message, to: string): Promise < Message > {
    return new Promise(async (resolve, reject) => {
        try {
            const existingId = await getUUID(message.identifier, message.provider);

            if (existingId) {
                message.conversationId = existingId.toHexString();
            } else {
                message = await createConversationId(message);
            }
            let messageusr = await addMessageUser(message, to, false);

            message = messageusr.message

            resolve(message);
        } catch (error) {
            console.error("Error in generateId function:", error);
            reject(error);
        }
    });
}
async function addMessageUser(message: any, to: string, read: boolean): Promise < any > {

    try {
        const dateMessage = new Date();

        const db = await getClient();
        const collection: any = db.collection('MENSAGENS');
        const uuid = new BSON.ObjectId();
        let conversationId = new BSON.ObjectId(message.conversationId)

        const data = {
            _id: uuid,
            conversationId: new BSON.ObjectId(message.conversationId),
            type: message.type,
            dateMessage: dateMessage.toISOString(),
            message: message.message,
            read: read,
            to: to,
        };

        await collection.insertOne(data);

        await updateName(conversationId, message.name, db, message.photo)


        return {
            "_id": uuid.toHexString(),
            "conversationId" : message.conversationId,
            "message" : data.message,
            "status": "success"
        };
    } catch (error) {
        console.error("Create ConversationId: ", error);
        throw error;
    }
}

async function updateName(conversationId: ObjectId, name: string, db: any, photo: any) {
    const filter = {
        _id: conversationId
    };
    const collection: any = db.collection('PROTOCOLOS');
    await collection.updateMany(filter, {
        $set: {
            name: name,
            photo: photo
        }
    });
}



async function createConversationId(message: Message): Promise < any > {
    return new Promise(async (resolve, reject) => {
        try {
            const dateMessage = new Date(); // Substitua isso pela sua data original

            const db = await getClient();
            const collection: any = db.collection('PROTOCOLOS');
            const uuid = new BSON.ObjectId()

            const data = {
                _id: uuid,
                identifier: message.identifier,
                firstContact: dateMessage.toISOString(),
                name: message.name,
                operatorId: message.operatorId || null,
                status: "A",
                provider: message.provider,
                photo: message.photo || null,
                dateCreated : dateMessage.toISOString(),
            };

            await collection.insertOne(data);

            message.conversationId = uuid.toHexString();

            resolve(message);
        } catch (error) {
            console.error("Create ConversationId: ", error);
            reject(error);
        }
    });
}

export async function getExisting(conversationId: string): Promise < any > {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await getClient();
            const collection = db.collection('PROTOCOLOS');

            const result: any = await collection.findOne({
                "_id": new BSON.ObjectId(conversationId),
                status: "A"
            });


            if (result) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            console.error("Get Existing ConversationId: ", error);
            reject(error);
        }
    });
}

export async function getProviderResp(params: any) {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await getClient();
            const collection = db.collection('PROTOCOLOS');

            const result: any = await collection.findOne({
                "_id": new BSON.ObjectId(params.conversationId),
                status: "A"
            });



            if (result) {
                if (params.operatorId) {
                    if (params.operatorId.toString() == result.operatorId.toString()) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                } else {
                    resolve(true)
                }
            } else {
                resolve(true);
            }
        } catch (error) {
            console.error("Get Existing ConversationId: ", error);
            reject(error);
        }
    });
}


async function getUUID(identifier: string, provider: string): Promise < any > {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await getClient();
            const collection = db.collection('PROTOCOLOS');

            const result: any = await collection.findOne({
                identifier,
                provider,
                status: 'A',
            });

            if (result) {
                resolve(result._id);
            } else {
                resolve(null);
            }
        } catch (error) {
            console.error("Get Existing ConversationId: ", error);
            reject(error);
        }
    });
}

export async function updateOperatorId(conversationId: string, operatorId: number): Promise < any > {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await getClient();
            const collection = db.collection('PROTOCOLOS');

            const result: any = await collection.findOne({
                _id: new BSON.ObjectId(conversationId),
                status: "A"
            });



            if (!result.operatorId) {
                await collection.updateMany({
                    _id: new BSON.ObjectId(conversationId)
                }, {
                    $set: {
                        operatorId: operatorId
                    }
                });
            }
            resolve("sucesso")

        } catch (error) {
            console.error("Get Existing ConversationId: ", error);
            reject(error);
        }
    });
}

export async function getReadMessage(idMessage: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await getClient();
            const collection = db.collection('MENSAGENS');

            const result: any = await collection.findOne({
                "_id": new BSON.ObjectId(idMessage),
                "read": false
            });


            if (result) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            console.error("Get Existing ConversationId: ", error);
            reject(error);
        }
    });
}

export async function updateReading(idMessage: string): Promise < any > {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await getClient();
            const collection = db.collection('MENSAGENS');

            await collection.updateMany({
                _id: new BSON.ObjectId(idMessage)
            }, {
                $set: {
                    read: true
                }
            });

            resolve("sucesso")

        } catch (error) {
            console.error("Error updateNotRead ", error);
            reject(error);
        }
    });
}

export async function createConversation(params: any) {
    return new Promise(async (resolve, reject) => {
        const dateMessage = new Date(); // Substitua isso pela sua data original

        let conversationIdExisting = await getUUID(params.identifier, params.provider)
        if (conversationIdExisting) {
            return resolve({
                "status": "error",
                "message": "There is already an open conversationId",
                "conversationId": conversationIdExisting
            })
        }
        try {
            let uuid = new BSON.ObjectId(params.conversationId)
            const db = await getClient();
            const collection = db.collection('PROTOCOLOS');
            let data: Message = {
                _id: uuid,
                identifier: params.identifier,
                firstContact: dateMessage.toISOString(),
                name: params.name,
                operatorId: params.operatorId,
                status: "A",
                provider: params.provider,
                dateCreated: dateMessage.toISOString(),
            }

            await collection.insertOne(data);

            resolve({
                status: "sucesso",
                conversationId: uuid
            })

        } catch (error) {
            console.error("Error createConversation ", error);
            reject({
                "status": "error"
            });
        }
    });
}

export async function updateStatusConversation(params: any) {
    return new Promise(async (resolve, reject) => {
        let conversationId = params.conversationId;
        let status = params.status || "A";
        let operatorId = params.operatorId; // Assuming operatorId is passed in params

        if (!await getExisting(conversationId)) {
            return resolve({
                "status": "error",
                "message": "Not conversationId existing or it is finished"
            });
        }

        try {
            const db = await getClient();
            const collection = db.collection('PROTOCOLOS');

            const updateObject: any = {
                $set: {
                    status: status
                }
            };

            if (operatorId !== undefined && operatorId !== null) {
                updateObject.$set.operatorId = operatorId;
            }

            await collection.updateMany({
                _id: new BSON.ObjectId(conversationId)
            }, updateObject);

            resolve({
                status: "success"
            });

        } catch (error) {
            console.error("Error updateStatusConversation ", error);
            reject({
                "status": "error"
            });
        }
    });
}



export {
    generateId,
    addMessageUser
};