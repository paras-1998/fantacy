const {UsersModel} = require('../../models/users');
import { User as  UserInterface , CreateUdrtInterface,  updateUser}  from '../../interfaces/admin/users/user.interface';


export const create = async(data:CreateUdrtInterface) : Promise<UserInterface> => UsersModel.create(data);

export const updateOneById = async(_id , data:updateUser)  =>{
    return UsersModel.updateOne({_id},{ $set : data });
}
export const findNupdateOneById = async(_id , data)  =>{
    return UsersModel.findOneAndUpdate({_id},data,{ new : true }).lean();
    
}

export const duplicateusernameValidation = async(username:string): Promise<boolean> => {
    // Function will return true if username is taken
    let countOfSameusername = await  UsersModel.countDocuments({ username });
    if(countOfSameusername > 0){
        return true;
    }
    else{
        return false;
    }
}


export const findOneById = async(_id,projection = "_id")  : Promise<UserInterface> =>UsersModel.findOne({_id},projection).lean();
export const findManyById = async(_id,projection = "_id")  : Promise<UserInterface[]> =>UsersModel.find({_id},projection).lean();

//export const list = async(user_id,projection = "_id",offset , limit = 10) : Promise<UserInterface[]> => UsersModel.find({},projection).skip((offset - 1) * limit).limit(limit).lean();

export const list = async(query,offset , limit = 10) : Promise<UserInterface[]> => {
    return UsersModel.aggregate([
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
        {   $project:{  username : 1 , password:1, balance:1,  id : "$_id" , createdAt:1 , status:1 } }
    ]);
};

export const countDoc = async(qry)  => UsersModel.countDocuments(qry);

export const deleteUser = async(_id)  =>UsersModel.deleteOne({_id});