import mongoose from 'mongoose'

import { Admin } from '../interfaces/admins/admin.interface';

interface AdminObjectInterface extends mongoose.Model<AdminObject> {
    build(attr: AdminObject): AdminObject
}

interface AdminObject extends mongoose.Document,Admin {
    _id : mongoose.Schema.Types.ObjectId
}

const schema = new mongoose.Schema({
    name :   { type : String ,required: true},
    email :   { type : String,required: true },
    password :   { type : String ,required: true},
},{
    timestamps: true,
    collection: "admins"
});


const admins = mongoose.model<AdminObject, AdminObjectInterface>('admins', schema,"admins")


export { admins as AdminsModel }