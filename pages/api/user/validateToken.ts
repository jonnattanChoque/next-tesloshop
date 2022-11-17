import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../src/db';
import { UserModel } from '../../../src/models';
import bcrypt from 'bcryptjs';
import { jwt } from '../../../src/utils';

type Data = 
| { message: string }
| { token: string; user: {email: string, name: string, role: string} }

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return validateToken(req, res);
            break
        default:
            res.status(405).json({ message: 'Method Not Allowed' })
            break
    }
}

const validateToken = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { tokenAuth = '' } = req.cookies

    if(!tokenAuth) {
        return res.status(401).json({ message: 'Token not found' })
    }

    try {
        const userId = await jwt.verifyToken(tokenAuth);

        await db.connect()
        const user = await UserModel.findById(userId).lean();
        await db.disconnect();

        if(!user) {
            return res.status(401).json({ message: 'User not found' })
        }

        const { role, name, _id, email } = user;
        const token = jwt.signToken(_id, email);
        const response = {
            token,
            user: {email, name, role, _id}
        }
        
        return res.status(200).json(response);
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' })
    }
}

    