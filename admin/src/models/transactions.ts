import mongoose from 'mongoose'

import { Transaction } from '../interfaces/admin/transactions/transaction.interface';


interface TransactionObjectInterface extends mongoose.Model<TransactionObject> {
    build(attr: TransactionObject): TransactionObject
}

interface TransactionObject extends mongoose.Document,Transaction {
    _id : mongoose.Schema.Types.ObjectId
}


const transactionsSchema = new mongoose.Schema({

    user : { type: mongoose.Schema.Types.ObjectId ,required: true  },

    dt: { type: String  }, // date 

    ob: { type: Number }, // opneing balance

    ar: { type: Number , default: 0 }, // admin recharege
    cb: { type: Number, default: 0 }, // closing balance

    ap: { type: Number, default: 0 }, // agent purchese
    aw: { type: Number, default: 0 }, // agent win
    aComm: { type: Number, default: 0 }, // agent commision


    aPay: { type: Number, default: 0 }, // admin pay
    createdDate: { type: Date, default: Date.now },
  
},{
    timestamps: true,
    collection: "transactions"
});
transactionsSchema.index({ user: 'text'});

const transactions = mongoose.model<TransactionObject, TransactionObjectInterface>('transactions', transactionsSchema,"transactions")


export { transactions as TransactionsModel }