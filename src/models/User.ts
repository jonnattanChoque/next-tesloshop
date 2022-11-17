import mongoose, { Schema, model, Model } from 'mongoose';
import { IUser } from '../interfaces/User';


const userSchema = new Schema({
    _id:        {type: Schema.Types.ObjectId, required: true},
    name:       { type: String, required: true },
    email:      { type: String, required: true, unique: true },
    password:   { type: String, required: true },
    role: {
        type: String,
        enum: {
            values: ['admin', 'client'],
            message: '{VALUE} no es un rol válido',
            default: 'client',
            required: true
        }
    }
},{
    timestamps: true
});

const UserModel: Model<IUser> = mongoose.models.User || model('User', userSchema );

export default UserModel;