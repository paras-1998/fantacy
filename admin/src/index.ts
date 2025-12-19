import express from 'express';
//import mongoose from 'mongoose';
import { json } from 'body-parser';
import cors from 'cors';
import path from "path";
import { Request, Response } from 'express';

import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';
import { authHandler  } from './middleware/auth.middleware';

// import { ConfigsRouter } from './routes/configs';

import { adminRouter } from './routes/admins';
import {  UsersRouter as AdminsUsersRouter } from './routes/admin/users';
import {  sessionRouter as AdminsSessionRouter } from './routes/admin/sessions';
import {  ConfigsRouter as AdminsConfigsRouter } from './routes/admin/configs';
import {  balancehistoryRouter as AdminsBalancehistory } from './routes/admin/balancehistory';

// import { WordsRouter } from './routes/words';
// import { SpeechesRouter } from './routes/speeches';
// import { ReactionsRouter } from './routes/reactions';
// import { FollowersRouter } from './routes/followers';
// import { timespentRouter } from './routes/timespents';
// import { reportspeechRouter } from './routes/reportspeech';
// import { reportuserRouter } from './routes/reportuser';
// import { searchRouter } from './routes/search';
// import { ianRouter } from './routes/ian';


import { initClientDbConnection } from '../init';


initClientDbConnection();


process.on('uncaughtException', function (err) {
  try {
    console.log('*** uncaughtException:', err);
    //mongoDal.log(err.message, err);
  } catch (err) { }
});


const app = express();





app.use(json());
app.use(cors());




app.get('/', function (req, res) {
    res.send("ok");
});

const buildPath = path.join(__dirname, "../admin_build");
console.log("Admin build path:", buildPath);
app.use(express.static(buildPath));
app.get("/admin", (req: Request, res: Response) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// app.use('/api/config',ConfigsRouter);

app.use('/api/admin/admins',adminRouter);
app.use('/api/admin/users',AdminsUsersRouter);
app.use('/api/admin/sessions',AdminsSessionRouter);
app.use('/api/admin/config',AdminsConfigsRouter);
app.use('/api/admin/balancehistory',AdminsBalancehistory);


// app.use('/api/search',searchRouter);
// app.use('/api/speech',SpeechesRouter);

// app.use(authHandler);

// app.use('/api/words',WordsRouter);

// app.use('/api/reaction',ReactionsRouter);
// app.use('/api/follower',FollowersRouter);
// app.use('/api/timespent',timespentRouter);
// app.use('/api/reportspeech',reportspeechRouter);
// app.use('/api/reportuser',reportuserRouter);
// app.use('/api/ian',ianRouter);




app.use(errorHandler);
app.use(notFoundHandler);
app.listen(process.env.PORT || 3005, () => {
  console.log('server is listening on port ' + (process.env.PORT || 3005));
});
