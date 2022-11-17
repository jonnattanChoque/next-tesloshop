import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../src/db';
import { UserModel } from '../../../src/models';
import bcrypt from 'bcryptjs';
import { jwt, validations } from '../../../src/utils';

type Data = 
| { message: string }
| { token: string; user: {email: string, name: string, role: string} }

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return registerUser(req, res);
            break
        case 'GET':
            res.status(200).json({ message: 'GET' })
            break
        default:
            res.status(405).json({ message: 'Method Not Allowed' })
            break
    }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email, password, name } = req.body

    // Validations
    if(!email || !password || !name) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    if(password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' })
    }
    if(name.length < 3) {
        return res.status(400).json({ message: 'Name must be at least 3 characters long' })
    }
    if(!validations.isValidEmail(email)) {
        return res.status(400).json({ message: 'Email is not valid' })
    }
    
    // Valida si el usuario ya existe
    await db.connect()
    const user = await UserModel.findOne({ email  });

    if(user) {
        await db.disconnect();
        return res.status(401).json({ message: 'User already exists' })
    }

    // Crea el usuario
    const newUser = new UserModel({
        email,
        password: bcrypt.hashSync(password),
        name,
        role: 'client'
    });

    try {
        await newUser.save({ validateBeforeSave: true });
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' })
    }

    // Genera el token y retorna el usuario
    const { role, _id } = newUser;
    const token = jwt.signToken(_id, email);
    const response = {
        token,
        user: {email, name, role, _id}
    }
    
    return res.status(200).json(response);
}