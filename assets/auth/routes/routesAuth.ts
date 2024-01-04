// routes/authRoutes.ts
import express, { Request, Response } from 'express';
import { generateToken, hashPassword, comparePasswords } from '../utils/utilsAuth';
import { getMongoDB } from '../../DB/BancoDeDados';
import { IUser } from '../models/modelsAuth';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const hashedPassword = await hashPassword(password);

        const db = getMongoDB();
        const usersCollection = db.collection<IUser>('users');

        const newUser = { username, password: hashedPassword };
        await usersCollection.insertOne(newUser);

        const token = generateToken({ userId: newUser._id });

        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no registro de usuário' });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const db = getMongoDB();
        const usersCollection = db.collection<IUser>('users');

        const user = await usersCollection.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const passwordMatch = await comparePasswords(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = generateToken({ userId: user._id });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no login de usuário' });
    }
});

export default router;
