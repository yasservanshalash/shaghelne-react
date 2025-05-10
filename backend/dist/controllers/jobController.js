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
const jobService_1 = __importDefault(require("../services/jobService"));
class JobController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { category, minBudget, maxBudget, status, skills, deadline } = req.query;
                const filters = {};
                if (category)
                    filters.category = category;
                if (minBudget)
                    filters.minBudget = parseFloat(minBudget);
                if (maxBudget)
                    filters.maxBudget = parseFloat(maxBudget);
                if (status)
                    filters.status = status;
                if (skills)
                    filters.skills = skills.split(',');
                if (deadline)
                    filters.deadline = new Date(deadline);
                const jobs = yield jobService_1.default.getAll(filters);
                return res.status(200).json(jobs);
            }
            catch (error) {
                console.error('Get jobs error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const job = yield jobService_1.default.getById(id);
                return res.status(200).json(job);
            }
            catch (error) {
                console.error('Get job error:', error);
                if (error.message === 'Job not found') {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const jobData = req.body;
                // Validate required fields
                if (!jobData.title || !jobData.description || !jobData.salary ||
                    !jobData.category) {
                    return res.status(400).json({
                        message: 'Required fields: title, description, salary, category'
                    });
                }
                const job = yield jobService_1.default.create(userId, jobData);
                return res.status(201).json(job);
            }
            catch (error) {
                console.error('Create job error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                const jobData = req.body;
                // Find job first to verify ownership
                const job = yield jobService_1.default.getById(id);
                // Verify ownership
                if (job.userId.toString() !== userId) {
                    return res.status(403).json({ message: 'Unauthorized - you can only update your own jobs' });
                }
                const updatedJob = yield jobService_1.default.update(id, jobData);
                return res.status(200).json(updatedJob);
            }
            catch (error) {
                console.error('Update job error:', error);
                if (error.message === 'Job not found') {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                // Find job first to verify ownership
                const job = yield jobService_1.default.getById(id);
                // Verify ownership
                if (job.userId.toString() !== userId) {
                    return res.status(403).json({ message: 'Unauthorized - you can only delete your own jobs' });
                }
                yield jobService_1.default.delete(id);
                return res.status(200).json({ message: 'Job deleted successfully' });
            }
            catch (error) {
                console.error('Delete job error:', error);
                if (error.message === 'Job not found') {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static getByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const jobs = yield jobService_1.default.getByUser(userId);
                return res.status(200).json(jobs);
            }
            catch (error) {
                console.error('Get jobs by user error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query, category, minBudget, maxBudget } = req.query;
                const criteria = {};
                if (query)
                    criteria.query = query;
                if (category)
                    criteria.category = category;
                if (minBudget)
                    criteria.minBudget = parseFloat(minBudget);
                if (maxBudget)
                    criteria.maxBudget = parseFloat(maxBudget);
                const jobs = yield jobService_1.default.search(criteria);
                return res.status(200).json(jobs);
            }
            catch (error) {
                console.error('Search jobs error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static getApplications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                // Find job first to verify ownership
                const job = yield jobService_1.default.getById(id);
                // Verify ownership
                if (job.userId.toString() !== userId) {
                    return res.status(403).json({
                        message: 'Unauthorized - you can only view applications for your own jobs'
                    });
                }
                const applications = yield jobService_1.default.getApplications(id);
                return res.status(200).json(applications);
            }
            catch (error) {
                console.error('Get job applications error:', error);
                if (error.message === 'Job not found') {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
}
exports.default = JobController;
