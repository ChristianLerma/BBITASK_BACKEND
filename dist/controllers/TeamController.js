"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMemberController = void 0;
const User_1 = __importDefault(require("../models/User"));
const Project_1 = __importDefault(require("../models/Project"));
class TeamMemberController {
    static findMemberByEmail = async (req, res) => {
        const { email } = req.body;
        //Find User
        const user = await User_1.default.findOne({ email }).select('_id name email');
        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({ error: error.message });
        }
        res.json(user);
    };
    static getProjectTeam = async (req, res) => {
        const project = await Project_1.default.findById(req.project.id).populate({
            path: 'team',
            select: 'id name email'
        });
        res.json(project.team);
    };
    static addMemberById = async (req, res) => {
        const { id } = req.body;
        //Find User
        const user = await User_1.default.findById(id).select('_id');
        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({ error: error.message });
        }
        if (req.project.team.some(team => team._id.toString() === user.id)) {
            const error = new Error('El Usuario ya ha sido asignado previamente al proyecto');
            return res.status(409).json({ error: error.message });
        }
        req.project.team.push(user.id);
        await req.project.save();
        res.send('Usuario agregado correctamente');
    };
    static removeMemberById = async (req, res) => {
        const { userId } = req.params;
        if (!req.project.team.some(team => team._id.toString() === userId)) {
            const error = new Error('El Usuario no existe en el proyecto');
            return res.status(409).json({ error: error.message });
        }
        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId);
        await req.project.save();
        res.send('Usuario eliminado correctamente');
    };
}
exports.TeamMemberController = TeamMemberController;
//# sourceMappingURL=TeamController.js.map