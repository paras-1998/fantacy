const {BalancehistoryModel} = require('../../models/balancehistory');
import { BalanceHistory as  BalanceHistoryInterface }  from '../../interfaces/admin/balanceHistory/balancehistory.interface';

export const create = async(data) : Promise<BalanceHistoryInterface> => BalancehistoryModel.create(data);


export const list = async(query,offset , limit = 10) : Promise<BalanceHistoryInterface[]> => {
    return BalancehistoryModel.aggregate([
        {
            $match: query
        },
        { $sort : { createdAt : -1 } },
        {
            $skip: (offset - 1) * limit
        },
        {
            $limit: limit
        },
        {
            $lookup:{
                from: 'users',
                let: { user_id: "$user" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: [ "$_id", "$$user_id" ] }
                        },
                    },
                    { $limit : 1 },
                    {  $project :{ username :1} }
                ],
                as: 'userData'
            }
        },
        {   $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$userData", 0 ] }, "$$ROOT" ] } } },
        {
            $lookup:{
                from: 'admins',
                let: { admin_id: "$admin" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: [ "$_id", "$$admin_id" ] }
                        },
                    },
                    { $limit : 1 },
                    {  $project :{ name :1} }
                ],
                as: 'adminData'
            }
        },
        {   $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$adminData", 0 ] }, "$$ROOT" ] } } },
        { $addFields: { id : "$_id"} },
        { $project : { amount : 1 , createdAt:1, name:1 , id:1 ,username:1 } }
    ]);
};

export const countDoc = async(qry)  => BalancehistoryModel.countDocuments(qry);