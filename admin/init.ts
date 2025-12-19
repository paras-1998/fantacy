import mongoose from 'mongoose';
import { config } from './config';

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
  
  const initClientDbConnection = async () => {
    
    const db = await mongoose.connect(config.MONGO_URL, /* option */).
    catch(error =>console.log('MongoDB Connection Error>> : ',error));
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
  };
  
  export { initClientDbConnection };
  