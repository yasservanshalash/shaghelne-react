"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Service_1 = __importDefault(require("../models/Service"));
dotenv_1.default.config();
const PLACEHOLDER_IMAGE = 'https://placehold.co/329x245/BCBCBC/FFFFFF';
function updateServiceImages() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Starting image update process...');
            // Connect to MongoDB - use the same connection string as the seed script
            const mongoUri = process.env.MONGODB_URL || 'mongodb://localhost:27017/freeio';
            console.log('Connecting to MongoDB at:', mongoUri);
            yield mongoose_1.default.connect(mongoUri);
            console.log('Connected to MongoDB');
            // Check if we can find any services
            const serviceCount = yield Service_1.default.countDocuments();
            console.log(`Found ${serviceCount} services in the database`);
            if (serviceCount === 0) {
                console.log('No services found to update');
                yield mongoose_1.default.connection.close();
                return;
            }
            // Update all services
            console.log('Updating services...');
            const result = yield Service_1.default.updateMany({}, // Match all documents
            {
                $set: {
                    images: [PLACEHOLDER_IMAGE]
                }
            });
            console.log(`Successfully updated ${result.modifiedCount} services with placeholder images`);
            // Close the connection
            yield mongoose_1.default.connection.close();
            console.log('Database connection closed');
        }
        catch (error) {
            console.error('Error updating service images:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            process.exit(1);
        }
    });
}
// Run the script
updateServiceImages();
