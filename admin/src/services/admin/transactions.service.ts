const {TransactionsModel } = require('../../models/transactions');
import { Transaction as  TransactionInterface }  from '../../interfaces/admin/transactions/transaction.interface';


export const findTransactionTheDay = async(user,dt,projection = "_id")  : Promise<TransactionInterface> =>TransactionsModel.findOne({user,dt},projection).lean();

export const create = async(data) : Promise<TransactionInterface> => TransactionsModel.create(data);

export const findNupdateOneById = async(_id , data)  =>{
    return TransactionsModel.findOneAndUpdate({_id},data,{ new : true }).lean();   
}