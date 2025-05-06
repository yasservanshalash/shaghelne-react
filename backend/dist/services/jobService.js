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
const Job_1 = __importStar(require("../models/Job"));
const JobApplication_1 = __importDefault(require("../models/JobApplication"));
class JobService {
    static getAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            let query = {};
            if (filters.category) {
                query.category = filters.category;
            }
            if (filters.minSalary !== undefined) {
                query.salary = { $gte: filters.minSalary };
            }
            if (filters.maxSalary !== undefined) {
                query.salary = Object.assign(Object.assign({}, query.salary), { $lte: filters.maxSalary });
            }
            if (filters.jobType) {
                query.jobType = filters.jobType;
            }
            if (filters.status) {
                query.status = filters.status;
            }
            else {
                query.status = Job_1.JobStatus.OPEN; // Default to open jobs
            }
            if (filters.location && filters.location.city) {
                query['location.city'] = filters.location.city;
            }
            const jobs = yield Job_1.default.find(query);
            return jobs;
        });
    }
    static getById(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield Job_1.default.findById(jobId);
            if (!job) {
                throw new Error('Job not found');
            }
            return job;
        });
    }
    static create(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield Job_1.default.create(Object.assign(Object.assign({}, data), { userId, status: Job_1.JobStatus.OPEN }));
            return job;
        });
    }
    static update(jobId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield Job_1.default.findByIdAndUpdate(jobId, Object.assign({}, data), { new: true });
            if (!job) {
                throw new Error('Job not found');
            }
            return job;
        });
    }
    static delete(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield Job_1.default.findByIdAndDelete(jobId);
            if (!job) {
                throw new Error('Job not found');
            }
            return { message: 'Job deleted successfully' };
        });
    }
    static getByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const jobs = yield Job_1.default.find({ userId });
            return jobs;
        });
    }
    static search(criteria) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {};
            if (criteria.query) {
                query.$or = [
                    { title: { $regex: criteria.query, $options: 'i' } },
                    { description: { $regex: criteria.query, $options: 'i' } }
                ];
            }
            if (criteria.category) {
                query.category = criteria.category;
            }
            if (criteria.jobType) {
                query.jobType = criteria.jobType;
            }
            if (criteria.location && criteria.location.city) {
                query['location.city'] = criteria.location.city;
            }
            if (criteria.minSalary !== undefined) {
                query.salary = { $gte: criteria.minSalary };
            }
            if (criteria.maxSalary !== undefined) {
                query.salary = Object.assign(Object.assign({}, query.salary), { $lte: criteria.maxSalary });
            }
            query.status = Job_1.JobStatus.OPEN; // Only search open jobs
            const jobs = yield Job_1.default.find(query);
            return jobs;
        });
    }
    static getApplications(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const applications = yield JobApplication_1.default.find({ jobId });
            return applications;
        });
    }
}
exports.default = JobService;
