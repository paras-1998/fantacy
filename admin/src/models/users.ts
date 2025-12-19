import mongoose from 'mongoose'

import { User} from '../interfaces/admin/users/user.interface';


interface UserObjectInterface extends mongoose.Model<UserObject> {
    build(attr: UserObject): UserObject
}

interface UserObject extends mongoose.Document,User {
    _id : mongoose.Schema.Types.ObjectId
}


const usersSchema = new mongoose.Schema({
  username : { type : String ,required: true},
    password :{ type : String ,required: true},
    balance:{type: Number , default: 0 },

    status :   { 
        type : Number ,
        enum: [1, 2], // 1-> active , 2 -> deactive
        default: 1,
    },
    isDeleted :   { 
        type : Number ,
        enum: [1, 0], // 0-> not deleted , 1  -> deleted
        default: 0,
    },
    deletedOn :   { 
        type : String,
        default: "-",
    },
},{
    timestamps: true,
    collection: "users"
});
usersSchema.index({ username: 'text'});

const users = mongoose.model<UserObject, UserObjectInterface>('users', usersSchema,"users")


export { users as UsersModel }