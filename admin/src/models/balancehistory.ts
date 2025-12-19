import mongoose from 'mongoose'

import { BalanceHistory } from '../interfaces/admin/balanceHistory/balancehistory.interface';


interface BalanceHistoryObjectInterface extends mongoose.Model<BalanceHistoryObject> {
    build(attr: BalanceHistoryObject): BalanceHistoryObject
}

interface BalanceHistoryObject extends mongoose.Document,BalanceHistory {
    _id : mongoose.Schema.Types.ObjectId
}

const balancehistorySchema = new mongoose.Schema({
    user : { type: mongoose.Schema.Types.ObjectId ,required: true  },
    admin : { type: mongoose.Schema.Types.ObjectId ,required: true  },

    

    amount: { type: Number ,required: true}, // opneing balance

  
},{
    timestamps: true,
    collection: "balancehistory"
});
balancehistorySchema.index({ admin: 'text'});

const balancehistory = mongoose.model<BalanceHistoryObject, BalanceHistoryObjectInterface>('balancehistory', balancehistorySchema,"balancehistory")


export { balancehistory as BalancehistoryModel }