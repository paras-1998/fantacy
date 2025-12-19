import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  status :   { 
    type : Number ,
    enum: [1, 2], // 1-> active , 2 -> deactive
    default: 1,
},
  activeSession: { type: String, default: null }, // Stores the active session token
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
