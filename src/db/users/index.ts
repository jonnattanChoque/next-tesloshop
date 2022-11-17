import { db } from '../../db';
import {  UserModel } from '../../models';


const getTotalUsers= async () => {
    await db.connect();
    const users = await UserModel.count({role: 'client'});
    await db.disconnect();
    return users
}

const dbUsers = {
    getTotalUsers
}

export default dbUsers;