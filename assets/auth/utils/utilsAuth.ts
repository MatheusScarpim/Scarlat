import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const secretKey = 'uc3026RLh89Am93';

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return null;
    }
};

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};
