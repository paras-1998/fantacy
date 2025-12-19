const {configsModel} = require('../../models/configs');
import { Config as  ConfigInterface ,  updateConfig}  from '../../interfaces/admin/configs/config.interface';


export const get = async(projection = "_id")  : Promise<ConfigInterface> =>configsModel.findOne({},projection).lean();


export const set = async( data:updateConfig)  =>{
    return configsModel.findOneAndUpdate({},{ $set : data },{ new : true }).lean();
    
}