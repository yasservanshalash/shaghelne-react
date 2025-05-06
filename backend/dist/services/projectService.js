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
const Project_1 = __importStar(require("../models/Project"));
const Proposal_1 = __importDefault(require("../models/Proposal"));
class ProjectService {
    static getAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            let query = {};
            if (filters.category) {
                query.category = filters.category;
            }
            if (filters.minBudget !== undefined) {
                query.budget = { $gte: filters.minBudget };
            }
            if (filters.maxBudget !== undefined) {
                query.budget = Object.assign(Object.assign({}, query.budget), { $lte: filters.maxBudget });
            }
            if (filters.status) {
                query.status = filters.status;
            }
            else {
                query.status = Project_1.ProjectStatus.OPEN; // Default to open projects
            }
            if (filters.skills && filters.skills.length > 0) {
                query.skills = { $in: filters.skills };
            }
            const projects = yield Project_1.default.find(query);
            return projects;
        });
    }
    static getById(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield Project_1.default.findById(projectId);
            if (!project) {
                throw new Error('Project not found');
            }
            return project;
        });
    }
    static create(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield Project_1.default.create(Object.assign(Object.assign({}, data), { userId, status: Project_1.ProjectStatus.OPEN }));
            return project;
        });
    }
    static update(projectId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield Project_1.default.findByIdAndUpdate(projectId, Object.assign({}, data), { new: true });
            if (!project) {
                throw new Error('Project not found');
            }
            return project;
        });
    }
    static delete(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield Project_1.default.findByIdAndDelete(projectId);
            if (!project) {
                throw new Error('Project not found');
            }
            return { message: 'Project deleted successfully' };
        });
    }
    static getByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const projects = yield Project_1.default.find({ userId });
            return projects;
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
            if (criteria.minBudget !== undefined) {
                query.budget = { $gte: criteria.minBudget };
            }
            if (criteria.maxBudget !== undefined) {
                query.budget = Object.assign(Object.assign({}, query.budget), { $lte: criteria.maxBudget });
            }
            if (criteria.skills && criteria.skills.length > 0) {
                query.skills = { $in: criteria.skills };
            }
            query.status = Project_1.ProjectStatus.OPEN; // Only search open projects
            const projects = yield Project_1.default.find(query);
            return projects;
        });
    }
    static getProposals(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const proposals = yield Proposal_1.default.find({ projectId });
            return proposals;
        });
    }
}
exports.default = ProjectService;
