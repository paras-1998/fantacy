const {SessionsModel } = require('../../models/sessions');
import { Session as  SessionInterface , createSession , updateSession}  from '../../interfaces/admin/sessions/session.interface';


//export const list = async(query,projection = "_id",offset , limit = 10) : Promise<SessionInterface[]> => SessionsModel.find(query,projection).skip((offset - 1) * limit).limit(limit).lean();

export const create = async(data:createSession) : Promise<SessionInterface> => SessionsModel.create(data);

export const findNupdateOneById = async(_id , data:updateSession)  =>{
    return SessionsModel.findOneAndUpdate({_id},{ $set : data },{ new : true }).lean();   
}

export const findManyById = async(_id,projection = "_id")  : Promise<SessionInterface[]> =>SessionsModel.find({_id},projection).lean();

export const list = async(query,offset , limit = 10) : Promise<SessionInterface[]> => {
    return SessionsModel.aggregate([
        {
            $match: query
        },
        { $sort : { startTime : -1 } },
        {
            $skip: (offset - 1) * limit
        },
        {
            $limit: limit
        },
        {
            $lookup:{
                from: 'tickets',
                let: { session_id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: [ "$session", "$$session_id" ] }
                        },
                    },
                    {
                        $group:
                          {
                            _id: "$user" ,
                            totalShree: { $sum: "$Shree" },
                            totalVashikaran: { $sum: "$Vashikaran" },
                            totalSudarshan: { $sum: "$Sudarshan" },
                            totalVastu: { $sum: "$Vastu" },
                            totalPlanet: { $sum: "$Planet" },
                            totalLove: { $sum: "$Love" },
                            totalTara: { $sum: "$Tara" },
                            totalGrah: { $sum: "$Grah" },
                            totalMatsya: { $sum: "$Matsya" },
                            totalMeditation: { $sum: "$Meditation" },
                          }
                    },
                    {
                        $lookup:{
                            from: 'users',
                            let: { user_id: "$_id" },
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
                    //{ $limit : 1 },
                    {  $project :{ userData :0} }
                ],
                as: 'ticketsData'
            }
        },
        { $addFields: { id : "$_id"} }
    ]);
};

export const countDoc = async(qry)  => SessionsModel.countDocuments(qry);

export const findOneById = async(_id,projection = "_id")  : Promise<SessionInterface> =>SessionsModel.findOne({_id},projection).lean();

export const deleteSession = async(_id)  =>SessionsModel.deleteOne({_id});