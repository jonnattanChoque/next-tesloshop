import { isValidObjectId } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../src/db';
import { IUser } from '../../../src/interfaces';
import { UserModel } from '../../../src/models';

type Data =
| {message: string}
| IUser[]

export default function handlres(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getUsers(req, res);
        case 'PUT':
            return updateUser(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse<Data>) {
    await db.connect();
    const users = await await UserModel.find().select('-password').lean();
    await db.disconnect();

    return res.status(200).json(users);
}

async function updateUser(req: NextApiRequest, res: NextApiResponse<{ message: string; }>) {
    const {userId = '', role = ''} = req.body;
    const validRoles = ['admin', 'client'];

    if(!isValidObjectId(userId)) {
        return res.status(400).json({message: 'Invalid user id'});
    }

    if(!validRoles.includes(role)) {
        return res.status(400).json({message: 'Invalid role'});
    }

    await db.connect();
    const user = await UserModel.findById(userId);

    if(!user) {
        await db.disconnect();
        return res.status(400).json({message: 'User not found'});
    }

    user.role = role;
    await user.save();    
    await db.disconnect();

    return res.status(200).json({message: 'User updated'});
}

