import mongoose from 'mongoose'

import { Session } from '../interfaces/admin/sessions/session.interface';


interface SessionObjectInterface extends mongoose.Model<SessionObject> {
    build(attr: SessionObject): SessionObject
}

interface SessionObject extends mongoose.Document,Session {
    _id : mongoose.Schema.Types.ObjectId
}


const sessionsSchema = new mongoose.Schema({

    startTime: Date,
    endTime: Date,

    Shree: { type: Number, default: 0 },
    Vashikaran: { type: Number, default: 0 },
    Sudarshan: { type: Number, default: 0 },
    Vastu: { type: Number, default: 0 },
    Planet: { type: Number, default: 0 },
    Love: { type: Number, default: 0 },
    Tara: { type: Number, default: 0 },
    Grah: { type: Number, default: 0 },
    Matsya: { type: Number, default: 0 },
    Meditation: { type: Number, default: 0 },


    ShreeAmount: { type: Number, default: 0 },
    VashikaranAmount: { type: Number, default: 0 },
    SudarshanAmount: { type: Number, default: 0 },
    VastuAmount: { type: Number, default: 0 },
    PlanetAmount: { type: Number, default: 0 },
    LoveAmount: { type: Number, default: 0 },
    TaraAmount: { type: Number, default: 0 },
    GrahAmount: { type: Number, default: 0 },
    MatsyaAmount: { type: Number, default: 0 },
    MeditationAmount: { type: Number, default: 0 },

    totalAmount: { type: Number, default: 0 },
    totalQty: { type: Number, default: 0 },
    payout: { type: Number, default: 0 },

    winner: { type: [String], default: [] },
    winnerType: { type: String, default: "", enum: ["2X", "3X", "1X",""] },

    isDone :   { 
        type : Number ,
        enum: [0,1], // 0 -> no , 1-> yes
        default: 0,
    },
    
    createdDate: { type: Date, default: Date.now },
  
},{
    timestamps: true,
    collection: "sessions"
});
sessionsSchema.index({ username: 'text'});
sessionsSchema.index({ email: 'text' });

const sessions = mongoose.model<SessionObject, SessionObjectInterface>('sessions', sessionsSchema,"sessions")


export { sessions as SessionsModel }