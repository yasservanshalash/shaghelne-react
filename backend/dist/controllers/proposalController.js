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
const proposalService_1 = __importDefault(require("../services/proposalService"));
const projectService_1 = __importDefault(require("../services/projectService"));
class ProposalController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, projectId } = req.query;
                const filters = {};
                if (status)
                    filters.status = status;
                if (projectId)
                    filters.projectId = projectId;
                const proposals = yield proposalService_1.default.getAll(filters);
                return res.status(200).json(proposals);
            }
            catch (error) {
                console.error('Get proposals error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const proposal = yield proposalService_1.default.getById(id);
                return res.status(200).json(proposal);
            }
            catch (error) {
                console.error('Get proposal error:', error);
                if (error.message === 'Proposal not found') {
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
                const { projectId, coverLetter, proposedPrice } = req.body;
                // Validate required fields
                if (!projectId || !coverLetter || !proposedPrice) {
                    return res.status(400).json({
                        message: 'Required fields: projectId, coverLetter, proposedPrice'
                    });
                }
                // Verify project exists
                try {
                    yield projectService_1.default.getById(projectId);
                }
                catch (error) {
                    return res.status(404).json({ message: 'Project not found' });
                }
                const proposalData = {
                    projectId,
                    coverLetter,
                    proposedPrice
                };
                const proposal = yield proposalService_1.default.create(userId, proposalData);
                return res.status(201).json(proposal);
            }
            catch (error) {
                console.error('Create proposal error:', error);
                if (error.message === 'You have already submitted a proposal for this project') {
                    return res.status(400).json({ message: error.message });
                }
                if (error.message === 'Project is not open for proposals') {
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
                const proposal = yield proposalService_1.default.getById(id);
                if (proposal.userId.toString() !== userId) {
                    return res.status(403).json({
                        message: 'Unauthorized - you can only update your own proposals'
                    });
                }
                // Can only update if proposal is pending
                if (proposal.status !== 'pending') {
                    return res.status(400).json({
                        message: 'Cannot update proposal that is not in pending status'
                    });
                }
                const updatedProposal = yield proposalService_1.default.update(id, updateData);
                return res.status(200).json(updatedProposal);
            }
            catch (error) {
                console.error('Update proposal error:', error);
                if (error.message === 'Proposal not found') {
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
                const proposal = yield proposalService_1.default.getById(id);
                if (proposal.userId.toString() !== userId) {
                    return res.status(403).json({
                        message: 'Unauthorized - you can only withdraw your own proposals'
                    });
                }
                // Can only withdraw if proposal is pending
                if (proposal.status !== 'pending') {
                    return res.status(400).json({
                        message: 'Cannot withdraw proposal that is not in pending status'
                    });
                }
                yield proposalService_1.default.withdraw(id);
                return res.status(200).json({ message: 'Proposal withdrawn successfully' });
            }
            catch (error) {
                console.error('Withdraw proposal error:', error);
                if (error.message === 'Proposal not found') {
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
                const proposals = yield proposalService_1.default.getByUser(userId);
                return res.status(200).json(proposals);
            }
            catch (error) {
                console.error('Get user proposals error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static getByProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const userId = req.user.id;
                // Get project to verify ownership
                const project = yield projectService_1.default.getById(projectId);
                // Verify project ownership
                if (project.userId.toString() !== userId) {
                    return res.status(403).json({
                        message: 'Unauthorized - you can only view proposals for your own projects'
                    });
                }
                const proposals = yield proposalService_1.default.getByProject(projectId);
                return res.status(200).json(proposals);
            }
            catch (error) {
                console.error('Get project proposals error:', error);
                if (error.message === 'Project not found') {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static approve(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                // Get proposal
                const proposal = yield proposalService_1.default.getById(id);
                // Get project to verify ownership
                const project = yield projectService_1.default.getById(proposal.projectId);
                // Verify project ownership
                if (project.userId.toString() !== userId) {
                    return res.status(403).json({
                        message: 'Unauthorized - you can only approve proposals for your own projects'
                    });
                }
                // Can only approve if proposal is pending
                if (proposal.status !== 'pending') {
                    return res.status(400).json({
                        message: 'Cannot approve proposal that is not in pending status'
                    });
                }
                const updatedProposal = yield proposalService_1.default.approve(id);
                return res.status(200).json(updatedProposal);
            }
            catch (error) {
                console.error('Approve proposal error:', error);
                if (error.message === 'Proposal not found') {
                    return res.status(404).json({ message: error.message });
                }
                if (error.message === 'Project not found') {
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
                // Get proposal
                const proposal = yield proposalService_1.default.getById(id);
                // Get project to verify ownership
                const project = yield projectService_1.default.getById(proposal.projectId);
                // Verify project ownership
                if (project.userId.toString() !== userId) {
                    return res.status(403).json({
                        message: 'Unauthorized - you can only reject proposals for your own projects'
                    });
                }
                // Can only reject if proposal is pending
                if (proposal.status !== 'pending') {
                    return res.status(400).json({
                        message: 'Cannot reject proposal that is not in pending status'
                    });
                }
                const updatedProposal = yield proposalService_1.default.reject(id);
                return res.status(200).json(updatedProposal);
            }
            catch (error) {
                console.error('Reject proposal error:', error);
                if (error.message === 'Proposal not found') {
                    return res.status(404).json({ message: error.message });
                }
                if (error.message === 'Project not found') {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
}
exports.default = ProposalController;
