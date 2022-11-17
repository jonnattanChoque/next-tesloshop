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
        case 'POST':
            return loginUser(req, res);
        case 'GET':
            res.status(200).json({ message: 'GET' })
            break
        default:
            res.status(405).json({ message: 'Method Not Allowed' })
            break
    }
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email = '', password = '' } = req.body

    await db.connect()
    const user = await UserModel.findOne({ email  });
    await db.disconnect();

    if(!user) {
        return res.status(401).json({ message: 'User not found' })
    }

    if(!bcrypt.compareSync(password, user.password!)) {
        return res.status(401).json({ message: 'Password is incorrect' })
    }

    const { role, name, _id } = user;
    const token = jwt.signToken(_id, email);
    const response = {
        token,
        user: {email, name, role, _id}
    }
    
    return res.status(200).json(response);
}