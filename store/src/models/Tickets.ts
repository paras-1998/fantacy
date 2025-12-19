import mongoose, { Schema, Document } from "mongoose";

interface ITicket extends Document {

  ticketNo:number,

  Shree:number,
  Vashikaran:number,
  Sudarshan:number,
  Vastu:number,
  Planet:number,
  Love:number,
  Tara:number,
  Grah:number,
  Matsya:number,
  Meditation:number,

  ShreeAmount:number,
  VashikaranAmount:number,
  SudarshanAmount:number,
  VastuAmount:number,
  PlanetAmount:number,
  LoveAmount:number,
  TaraAmount:number,
  GrahAmount:number,
  MatsyaAmount:number,
  MeditationAmount:number,

  totalAmount: Number,
  totalQty: Number,

  isClaimed :   Number,
  createdDate: Date;
}

const TicketSchema: Schema = new Schema({
  user: { type: mongoose.Schema.ObjectId, required: true },
  
  session: { type: mongoose.Schema.ObjectId, required: true },
  
  

  ticketNo: { type: Number },

  Shree: { type: Number },
  Vashikaran: { type: Number },
  Sudarshan: { type: Number },
  Vastu: { type: Number },
  Planet: { type: Number },
  Love: { type: Number },
  Tara: { type: Number },
  Grah: { type: Number },
  Matsya: { type: Number },
  Meditation: { type: Number },


  ShreeAmount: { type: Number },
  VashikaranAmount: { type: Number },
  SudarshanAmount: { type: Number },
  VastuAmount: { type: Number },
  PlanetAmount: { type: Number },
  LoveAmount: { type: Number },
  TaraAmount: { type: Number },
  GrahAmount: { type: Number },
  MatsyaAmount: { type: Number },
  MeditationAmount: { type: Number },

  totalAmount: { type: Number, default: 0 },
  totalQty: { type: Number, default: 0 },
  
  isClaimed :   { 
      type : Number ,
      enum: [0,1], // 0 -> no , 1-> yes
      default: 0,
  },

  createdDate: { type: Date, default: Date.now },


});
const Tickets = mongoose.models.tickets || mongoose.model<ITicket>("tickets", TicketSchema);


export default Tickets;