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
Object.defineProperty(exports, "__esModule", { value: true });
const Proposal_1 = __importStar(require("../models/Proposal"));
const Project_1 = __importStar(require("../models/Project"));
class ProposalService {
    static getAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            let query = {};
            if (filters.status) {
                query.status = filters.status;
            }
            if (filters.projectId) {
                query.projectId = filters.projectId;
            }
            const proposals = yield Proposal_1.default.find(query);
            return proposals;
        });
    }
    static getById(proposalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const proposal = yield Proposal_1.default.findById(proposalId);
            if (!proposal) {
                throw new Error('Proposal not found');
            }
            return proposal;
        });
    }
    static create(userId, projectId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if project exists
            const project = yield Project_1.default.findById(projectId);
            if (!project) {
                throw new Error('Project not found');
            }
            // Check if project is open
            if (project.status !== Project_1.ProjectStatus.OPEN) {
                throw new Error('Cannot submit proposal to a closed project');
            }
            // Check if user already submitted a proposal
            const existingProposal = yield Proposal_1.default.findOne({
                userId,
                projectId
            });
            if (existingProposal) {
                throw new Error('You have already submitted a proposal for this project');
            }
            const proposal = yield Proposal_1.default.create(Object.assign(Object.assign({}, data), { userId,
                projectId, status: Proposal_1.ProposalStatus.PENDING }));
            return proposal;
        });
    }
    static update(proposalId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const proposal = yield Proposal_1.default.findByIdAndUpdate(proposalId, Object.assign({}, data), { new: true });
            if (!proposal) {
                throw new Error('Proposal not found');
            }
            return proposal;
        });
    }
    static withdraw(proposalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const proposal = yield Proposal_1.default.findByIdAndUpdate(proposalId, { status: Proposal_1.ProposalStatus.WITHDRAWN }, { new: true });
            if (!proposal) {
                throw new Error('Proposal not found');
            }
            return proposal;
        });
    }
    static getByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const proposals = yield Proposal_1.default.find({ userId });
            return proposals;
        });
    }
    static getByProject(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const proposals = yield Proposal_1.default.find({ projectId });
            return proposals;
        });
    }
    static approve(proposalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const proposal = yield Proposal_1.default.findByIdAndUpdate(proposalId, { status: Proposal_1.ProposalStatus.ACCEPTED }, { new: true });
            if (!proposal) {
                throw new Error('Proposal not found');
            }
            // Update project status
            yield Project_1.default.findByIdAndUpdate(proposal.projectId, { status: Project_1.ProjectStatus.IN_PROGRESS });
            return proposal;
        });
    }
    static reject(proposalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const proposal = yield Proposal_1.default.findByIdAndUpdate(proposalId, { status: Proposal_1.ProposalStatus.REJECTED }, { new: true });
            if (!proposal) {
                throw new Error('Proposal not found');
            }
            return proposal;
        });
    }
}
exports.default = ProposalService;
