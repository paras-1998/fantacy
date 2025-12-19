"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import mongoose from 'mongoose';
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const error_middleware_1 = require("./middleware/error.middleware");
const not_found_middleware_1 = require("./middleware/not-found.middleware");
// import { ConfigsRouter } from './routes/configs';
const admins_1 = require("./routes/admins");
const users_1 = require("./routes/admin/users");
const sessions_1 = require("./routes/admin/sessions");
const configs_1 = require("./routes/admin/configs");
const balancehistory_1 = require("./routes/admin/balancehistory");
// import { WordsRouter } from './routes/words';
// import { SpeechesRouter } from './routes/speeches';
// import { ReactionsRouter } from './routes/reactions';
// import { FollowersRouter } from './routes/followers';
// import { timespentRouter } from './routes/timespents';
// import { reportspeechRouter } from './routes/reportspeech';
// import { reportuserRouter } from './routes/reportuser';
// import { searchRouter } from './routes/search';
// import { ianRouter } from './routes/ian';
const init_1 = require("../init");
(0, init_1.initClientDbConnection)();
process.on('uncaughtException', function (err) {
    try {
        console.log('*** uncaughtException:', err);
        //mongoDal.log(err.message, err);
    }
    catch (err) { }
});
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
app.use((0, cors_1.default)());
app.get('/', function (req, res) {
    res.send("ok");
});
const buildPath = path_1.default.join(__dirname, "../../admin_build");
app.use(express_1.default.static(buildPath));
app.get("/admin", (req, res) => {
    res.sendFile(path_1.default.join(buildPath, "index.html"));
});
// app.use('/api/config',ConfigsRouter);
app.use('/api/admin/admins', admins_1.adminRouter);
app.use('/api/admin/users', users_1.UsersRouter);
app.use('/api/admin/sessions', sessions_1.sessionRouter);
app.use('/api/admin/config', configs_1.ConfigsRouter);
app.use('/api/admin/balancehistory', balancehistory_1.balancehistoryRouter);
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
app.use(error_middleware_1.errorHandler);
app.use(not_found_middleware_1.notFoundHandler);
app.listen(process.env.PORT || 3005, () => {
    console.log('server is listening on port ' + (process.env.PORT || 3005));
});
//# sourceMappingURL=index.js.map