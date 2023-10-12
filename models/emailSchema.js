import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("UserList", userSchema);
