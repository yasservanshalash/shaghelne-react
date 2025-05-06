"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const JobApplication_1 = __importStar(require("../models/JobApplication"));
const Job_1 = __importDefault(require("../models/Job"));
class JobApplicationService {
    static getAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            let query = {};
            if (filters.status) {
                query.status = filters.status;
            }
            if (filters.jobId) {
                query.jobId = filters.jobId;
            }
            const applications = yield JobApplication_1.default.find(query);
            return applications;
        });
    }
    static getById(applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = yield JobApplication_1.default.findById(applicationId);
            if (!application) {
                throw new Error('Job application not found');
            }
            return application;
        });
    }
    static create(userId, jobId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if job exists
            const job = yield Job_1.default.findById(jobId);
            if (!job) {
                throw new Error('Job not found');
            }
            // Check if user already applied
            const existingApplication = yield JobApplication_1.default.findOne({
                userId,
                jobId
            });
            if (existingApplication) {
                throw new Error('You have already applied for this job');
            }
            const application = yield JobApplication_1.default.create(Object.assign(Object.assign({}, data), { userId,
                jobId, status: JobApplication_1.JobApplicationStatus.PENDING }));
            return application;
        });
    }
    static update(applicationId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = yield JobApplication_1.default.findByIdAndUpdate(applicationId, Object.assign({}, data), { new: true });
            if (!application) {
                throw new Error('Job application not found');
            }
            return application;
        });
    }
    static withdraw(applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = yield JobApplication_1.default.findByIdAndUpdate(applicationId, { status: JobApplication_1.JobApplicationStatus.WITHDRAWN }, { new: true });
            if (!application) {
                throw new Error('Job application not found');
            }
            return application;
        });
    }
    static getByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const applications = yield JobApplication_1.default.find({ userId });
            return applications;
        });
    }
    static approve(applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = yield JobApplication_1.default.findByIdAndUpdate(applicationId, { status: JobApplication_1.JobApplicationStatus.ACCEPTED }, { new: true });
            if (!application) {
                throw new Error('Job application not found');
            }
            return application;
        });
    }
    static reject(applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = yield JobApplication_1.default.findByIdAndUpdate(applicationId, { status: JobApplication_1.JobApplicationStatus.REJECTED }, { new: true });
            if (!application) {
                throw new Error('Job application not found');
            }
            return application;
        });
    }
}
exports.default = JobApplicationService;
