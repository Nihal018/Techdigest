import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB(): Promise<void> {
  try {
    const uri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/techdigest";
    console.log("Attempting to connect to MongoDB at:", uri);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Mongoose connection established successfully");
    });

    connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    connection.on("disconnected", () => {
      console.log("Mongoose connection disconnected");
    });

    if (connection.readyState === 1) {
      const collections = await connection.db?.listCollections().toArray();
      if (collections) {
        console.log(
          "Available collections:",
          collections.map((c) => c.name)
        );
      }
    }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}
