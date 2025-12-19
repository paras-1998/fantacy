"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initClientDbConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const clientOption = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000,
    poolSize: 50,
    useNewUrlParser: true,
    autoIndex: false,
};
const option = {
    /* socketTimeoutMS: 30000,
    keepAlive: true, */
    useNewUrlParser: true,
    useUnifiedTopology: true,
    /* useFindAndModify: false, */
    /*
    reconnectTries: 30000,
    
    useUnifiedTopology: true  */
};
const initClientDbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield mongoose_1.default.connect(config_1.config.MONGO_URL).
        catch(error => console.log('MongoDB Connection Error>> : ', error));
    console.log('client MongoDB Connection ok!');
    require('./src/models/users');
    /* db.on('error', console.error.bind(console, ));
    db.once('open', function () {
      
    });  */
    /* mongoose.connect(config.MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log('DB connection connected successfully');
        
    } else {
        console.log('error in creating DB connection', err);
    }
}); */
    //
    /* */
    /* require('./models/todo');
    require('./models/workflows');
    require('./models/identifierstate');
    require('./models/reminders');
    require('./models/taskresponses');
    require('./models/agents');
    require('./models/permission');
    require('./models/location'); */
    //return db;
});
exports.initClientDbConnection = initClientDbConnection;
//# sourceMappingURL=init.js.map