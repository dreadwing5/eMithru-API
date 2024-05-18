// models/Role.js
import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: [String],
});

const Role = mongoose.model("Role", roleSchema);

export default Role;
