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
const jobApplicationService_1 = __importDefault(require("../services/jobApplicationService"));
const jobService_1 = __importDefault(require("../services/jobService"));
class JobApplicationController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, jobId } = req.query;
                const filters = {};
                if (status)
                    filters.status = status;
                if (jobId)
                    filters.jobId = jobId;
                const applications = yield jobApplicationService_1.default.getAll(filters);
                return res.status(200).json(applications);
            }
            catch (error) {
                console.error('Get applications error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const application = yield jobApplicationService_1.default.getById(id);
                return res.status(200).json(application);
            }
            catch (error) {
                console.error('Get application error:', error);
                if (error.message === 'Application not found') {
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
                const { jobId, coverLetter, proposedPrice } = req.body;
                // Validate required fields
                if (!jobId || !coverLetter) {
                    return res.status(400).json({
                        message: 'Required fields: jobId, coverLetter'
                    });
                }
                // Verify job exists
                try {
                    yield jobService_1.default.getById(jobId);
                }
                catch (error) {
                    return res.status(404).json({ message: 'Job not found' });
                }
                const applicationData = {
                    jobId,
                    coverLetter,
                    proposedPrice
                };
                const application = yield jobApplicationService_1.default.create(userId, applicationData);
                return res.status(201).json(application);
            }
            catch (error) {
                console.error('Create application error:', error);
                if (error.message === 'You have already applied to this job') {
                    return res.status(400).json({ message: error.message });
                }
                if (error.message === 'Job is not open for applications') {
                    return res.status(400).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                const updateData = req.body;
                // Verify ownership
                const application = yield jobApplicationService_1.default.getById(id);
                if (application.userId.toString() !== userId) {
                    return res.status(403).json({
                        message: 'Unauthorized - you can only update your own applications'
                    });
                }
                // Can only update if application is pending
                if (application.status !== 'pending') {
                    return res.status(400).json({
                        message: 'Cannot update application that is not in pending status'
                    });
                }
                const updatedApplication = yield jobApplicationService_1.default.update(id, updateData);
                return res.status(200).json(updatedApplication);
            }
            catch (error) {
                console.error('Update application error:', error);
                if (error.message === 'Application not found') {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static withdraw(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                // Verify ownership
                const application = yield jobApplicationService_1.default.getById(id);
                if (application.userId.toString() !== userId) {
                    return res.status(403).json({
                        message: 'Unauthorized - you can only withdraw your own applications'
                    });
                }
                // Can only withdraw if application is pending
                if (application.status !== 'pending') {
                    return res.status(400).json({
                        message: 'Cannot withdraw application that is not in pending status'
                    });
                }
                yield jobApplicationService_1.default.withdraw(id);
                return res.status(200).json({ message: 'Application withdrawn successfully' });
            }
            catch (error) {
                console.error('Withdraw application error:', error);
                if (error.message === 'Application not found') {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static getByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const applications = yield jobApplicationService_1.default.getByUser(userId);
                return res.status(200).json(applications);
            }
            catch (error) {
                console.error('Get user applications error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static approve(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                // Get application
                const application = yield jobApplicationService_1.default.getById(id);
                // Get job to verify ownership
                const job = yield jobService_1.default.getById(application.jobId);
                // Verify job ownership
                if (job.userId.toString() !== userId) {
                    return res.status(403).json({
                        message: 'Unauthorized - you can only approve applications for your own jobs'
                    });
                }
                // Can only approve if application is pending
                if (application.status !== 'pending') {
                    return res.status(400).json({
                        message: 'Cannot approve application that is not in pending status'
                    });
                }
                const updatedApplication = yield jobApplicationService_1.default.approve(id);
                return res.status(200).json(updatedApplication);
            }
            catch (error) {
                console.error('Approve application error:', error);
                if (error.message === 'Application not found') {
                    return res.status(404).json({ message: error.message });
                }
                if (error.message === 'Job not found') {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static reject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                // Get application
                const application = yield jobApplicationService_1.default.getById(id);
                // Get job to verify ownership
                const job = yield jobService_1.default.getById(application.jobId);
                // Verify job ownership
                if (job.userId.toString() !== userId) {
                    return res.status(403).json({
                        message: 'Unauthorized - you can only reject applications for your own jobs'
                    });
                }
                // Can only reject if application is pending
                if (application.status !== 'pending') {
                    return res.status(400).json({
                        message: 'Cannot reject application that is not in pending status'
                    });
                }
                const updatedApplication = yield jobApplicationService_1.default.reject(id);
                return res.status(200).json(updatedApplication);
            }
            catch (error) {
                console.error('Reject application error:', error);
                if (error.message === 'Application not found') {
                    return res.status(404).json({ message: error.message });
                }
                if (error.message === 'Job not found') {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
}
exports.default = JobApplicationController;
