import mongoose from "mongoose";


const metaConnectionSchema = new mongoose.Schema(
{
userId: { type: String, required: true },
metaBusinessId: { type: String, required: true },
wabaId: { type: String, required: true },
phoneNumberId: { type: String, required: true },
displayPhoneNumber: { type: String },
status: { type: String, enum: ["CONNECTED", "DISCONNECTED"], default: "CONNECTED" },
},
{ timestamps: true }
);


export default mongoose.model("MetaConnection", metaConnectionSchema);