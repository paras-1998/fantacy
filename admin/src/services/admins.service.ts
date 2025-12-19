const {AdminsModel} = require('../models/admins');
import { Admin as  AdminInterface }  from '../interfaces/admins/admin.interface';



export const create = async(data:AdminInterface) : Promise<AdminInterface> => AdminsModel.create(data);

export const findNupdateOneById = async(_id , data:AdminInterface)  =>{
    return AdminsModel.findOneAndUpdate({_id},{ $set : data },{ new : true }).lean();
}

export const duplicateEmailValidation = async(email:string): Promise<boolean> => {
    // Function will return true if email is taken
    let countOfSameEmail = await  AdminsModel.countDocuments({ email });
    if(countOfSameEmail > 0){
        return true;
    }
    else{
        return false;
    }
}

export const findOneById = async(_id,projection = "_id")  : Promise<AdminInterface> =>AdminsModel.findOne({_id},projection).lean();
export const findOneByEmail = async(email,projection = "_id")  : Promise<AdminInterface> =>AdminsModel.findOne({email},projection).lean();


export const list = async(user_id,offset , limit = 10) : Promise<AdminInterface[]> => {
    return AdminsModel.aggregate([
        {
            $skip: (offset - 1) * limit
        },
        {
            $limit: limit
        },
        {   $project:{  name : 1 , email:1, id : "$_id"} }
    ]);
};

export const countDoc = async(qry)  => AdminsModel.countDocuments(qry);

export const deleteOneById = async(_id)  =>AdminsModel.deleteOne({_id});

export const deleteManyById = async(_ids)  =>AdminsModel.deleteMany({_id : { $in : _ids }});