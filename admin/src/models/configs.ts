import mongoose from 'mongoose'

import { Config} from '../interfaces/admin/configs/config.interface';


interface ConfigObjectInterface extends mongoose.Model<ConfigObject> {
    build(attr: ConfigObject): ConfigObject
}

interface ConfigObject extends mongoose.Document,Config {
    _id : mongoose.Schema.Types.ObjectId
}


const configsSchema = new mongoose.Schema({
    commissionPercentage:{type: Number , default: 0 },
},{
    timestamps: true,
    collection: "configs"
});
const configs = mongoose.model<ConfigObject, ConfigObjectInterface>('configs', configsSchema,"configs")


export { configs as configsModel }