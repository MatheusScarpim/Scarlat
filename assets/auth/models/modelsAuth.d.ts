import {
    BSON,
    ObjectId,
} from 'mongodb';

export interface IUser {
    _id ? : BSON.ObjectId;
    username: string;
    password: string;
}