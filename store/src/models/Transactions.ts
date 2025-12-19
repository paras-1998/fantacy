import mongoose, { Schema, Document } from "mongoose";

interface ITransaction extends Document {
  ar: number, // admin recharege
  dt: string;
  ob: number;
  cb: number;
  ap: number;
  aw: number;
  aComm: number;
  aPay: number;
  createdDate: Date;
}

const TransactionSchema: Schema = new Schema({
  user: { type: mongoose.Schema.ObjectId, required: true },
  ar: { type: Number , default: 0 }, // admin recharege
  dt: { type: String, required: true },
  ob: { type: Number, required: true },
  cb: { type: Number, default: 0 },
  ap: { type: Number, default: 0 },
  aw: { type: Number, default: 0 },
  aComm: { type: Number, default: 0 },
  aPay: { type: Number, default: 0 },
  createdDate: { type: Date, default: Date.now },
});

//const Transaction = mongoose.model<ITransaction>("transactions", TransactionSchema);
const Transaction =
  mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);


export default Transaction;