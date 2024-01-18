import express, {
  Request,
  Response
} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  getClient
} from '../../database/dataBase';
import {
  IUser
} from '../models/modelsAuth';
import bodyParser from 'body-parser';

const router = express.Router();
router.use(bodyParser.json({
  limit: '50mb'
}));

router.post('/register', async (req: Request, res: Response) => {
  try {
    const {
      username,
      password
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const db = await getClient();
    const usersCollection = db.collection < IUser > ('users');

    const newUser: IUser = {
      username,
      password: hashedPassword,
    };
    const result = await usersCollection.insertOne(newUser);

    const token = generateToken(result.insertedId.toHexString());

    res.status(201).json({
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error in user registration.',
    });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const {
      username,
      password
    } = req.body;

    const db = await getClient();
    const usersCollection = db.collection < IUser > ('users');

    const user = await usersCollection.findOne({
      username,
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid username.',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Invalid password.',
      });
    }

    const token = generateToken(user._id.toHexString());

    res.status(200).json({
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error in user login.',
    });
  }
});

const tokenConfig = {
  expiresIn: '30m',
  secret: process.env.JWT_SECRET || 'S1Rl1t2330porta',
};

const generateToken = (userId: string | undefined): string => {
  return jwt.sign({
    userId
  }, tokenConfig.secret, {
    expiresIn: tokenConfig.expiresIn
  });
};

export default router;