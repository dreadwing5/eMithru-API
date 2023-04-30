// import { MongoClient } from "mongodb";
import Mongoose from "mongoose";

const uri = process.env.MONGODB_URI.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

async function connectDB() {
  try {
    // family : Use IPv4, skip trying IPv6
    await Mongoose.connect(uri, { family: 4 });
    console.log("DB CONNECTED SUCCESSFULLY!");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}

export default connectDB;
