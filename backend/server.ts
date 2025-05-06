// server.ts
// connect database here
import mongoose from "mongoose"; // mongoose library
import dotenv from "dotenv"; // dotenv library to secure secrets

import app from "./app";

dotenv.config();

const port = process.env.PORT || 8000;

console.log("Starting Freeio Freelance Platform Backend...");

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGODB_URL as string)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      console.log(`API documentation available at http://localhost:${port}/api-docs`);
    });
  })
  .catch((error: Error) => {
    console.log("MongoDB connection failed", error);
    process.exit(1);
  }); 