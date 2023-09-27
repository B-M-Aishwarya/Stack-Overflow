import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  about: { type: String },
  tags: { type: [String] },
  joinedOn: { type: Date, default: Date.now },
  plan: {
    selectedPlan: { type: String, default: 'Free', required: true },
    selectedPlanOn: { type: Date, default: Date.now } ,
  },
  noOfQuestions: { type: Number, default:1, required:true },
  badges: {
    Silver: { type: Number, default: 0 },
    Bronze: { type: Number, default: 0 },
    Gold: { type: Number, default: 0 }
  }
})

export default mongoose.model("User", userSchema)
