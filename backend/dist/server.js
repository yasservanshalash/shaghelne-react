"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
// connect database here
const mongoose_1 = __importDefault(require("mongoose")); // mongoose library
const dotenv_1 = __importDefault(require("dotenv")); // dotenv library to secure secrets
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const port = process.env.PORT || 8000;
console.log("Starting Freeio Freelance Platform Backend...");
mongoose_1.default.set("strictQuery", false);
mongoose_1.default
    .connect(process.env.MONGODB_URL)
    .then(() => {
    console.log("Connected to MongoDB successfully");
    app_1.default.listen(port, () => {
        console.log(`Server listening on port ${port}`);
        console.log(`API documentation available at http://localhost:${port}/api-docs`);
    });
})
    .catch((error) => {
    console.log("MongoDB connection failed", error);
    process.exit(1);
});
