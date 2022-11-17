import { rejects } from 'assert';
import jwt from 'jsonwebtoken';

export const signToken = (_id: string, email: string) => {
    if(!process.env.JWT_SEED) {
        throw new Error('JWT SECRET TOKEN is not defined');
    }

    return jwt.sign(
        {_id, email},
        process.env.JWT_SEED,
        {expiresIn: '30d'}
    )
}

export const verifyToken = (token: string) => {
    if(!process.env.JWT_SEED) {
        throw new Error('JWT SECRET TOKEN is not defined');
    }
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.JWT_SEED || '', (err, decoded) => {
                if(err) reject(err);
                const { _id } = decoded as {_id: string};
                resolve(_id);
            })
        } catch (error) {
            reject('Token is not valid');
        }
    })
}