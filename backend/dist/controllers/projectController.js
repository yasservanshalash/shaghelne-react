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
const projectService_1 = __importDefault(require("../services/projectService"));
class ProjectController {
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
                const projects = yield projectService_1.default.getAll(filters);
                return res.status(200).json(projects);
            }
            catch (error) {
                console.error('Get projects error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const project = yield projectService_1.default.getById(id);
                return res.status(200).json(project);
            }
            catch (error) {
                console.error('Get project error:', error);
                if (error.message === 'Project not found') {
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
                const projectData = req.body;
                // Validate required fields
                if (!projectData.title || !projectData.description || !projectData.budget ||
                    !projectData.category || !projectData.deadline) {
                    return res.status(400).json({
                        message: 'Required fields: title, description, budget, category, deadline'
                    });
                }
                const project = yield projectService_1.default.create(userId, projectData);
                return res.status(201).json(project);
            }
            catch (error) {
                console.error('Create project error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                const projectData = req.body;
                // Find project first to verify ownership
                const project = yield projectService_1.default.getById(id);
                // Verify ownership
                if (project.userId.toString() !== userId) {
                    return res.status(403).json({ message: 'Unauthorized - you can only update your own projects' });
                }
                const updatedProject = yield projectService_1.default.update(id, projectData);
                return res.status(200).json(updatedProject);
            }
            catch (error) {
                console.error('Update project error:', error);
                if (error.message === 'Project not found') {
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
                // Find project first to verify ownership
                const project = yield projectService_1.default.getById(id);
                // Verify ownership
                if (project.userId.toString() !== userId) {
                    return res.status(403).json({ message: 'Unauthorized - you can only delete your own projects' });
                }
                yield projectService_1.default.delete(id);
                return res.status(200).json({ message: 'Project deleted successfully' });
            }
            catch (error) {
                console.error('Delete project error:', error);
                if (error.message === 'Project not found') {
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
                const projects = yield projectService_1.default.getByUser(userId);
                return res.status(200).json(projects);
            }
            catch (error) {
                console.error('Get projects by user error:', error);
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
                const projects = yield projectService_1.default.search(criteria);
                return res.status(200).json(projects);
            }
            catch (error) {
                console.error('Search projects error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static getProposals(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                // Find project first to verify ownership
                const project = yield projectService_1.default.getById(id);
                // Verify ownership
                if (project.userId.toString() !== userId) {
                    return res.status(403).json({
                        message: 'Unauthorized - you can only view proposals for your own projects'
                    });
                }
                const proposals = yield projectService_1.default.getProposals(id);
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
}
exports.default = ProjectController;
