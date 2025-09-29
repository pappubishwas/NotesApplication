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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNote = exports.deleteNote = exports.getNotesById = exports.getNotes = exports.createNote = void 0;
var Note_1 = __importDefault(require("../models/Note"));
var createNote = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, content, user, note;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, title = _a.title, content = _a.content;
                user = req.user;
                note = new Note_1.default({ title: title, content: content, user: user._id });
                return [4 /*yield*/, note.save()];
            case 1:
                _b.sent();
                return [2 /*return*/, res.json(note)];
        }
    });
}); };
exports.createNote = createNote;
var getNotes = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, notes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                return [4 /*yield*/, Note_1.default.find({ user: user._id }).sort({ createdAt: -1 })];
            case 1:
                notes = _a.sent();
                return [2 /*return*/, res.json(notes)];
        }
    });
}); };
exports.getNotes = getNotes;
var getNotesById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, id, note;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                id = req.params.id;
                return [4 /*yield*/, Note_1.default.findOne({ _id: id, user: user._id })];
            case 1:
                note = _a.sent();
                if (!note)
                    return [2 /*return*/, res.status(404).json({ message: "Note not found" })];
                return [2 /*return*/, res.json(note)];
        }
    });
}); };
exports.getNotesById = getNotesById;
var deleteNote = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, id, note;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                id = req.params.id;
                return [4 /*yield*/, Note_1.default.findOneAndDelete({ _id: id, user: user._id })];
            case 1:
                note = _a.sent();
                if (!note)
                    return [2 /*return*/, res.status(404).json({ message: "Note not found" })];
                return [2 /*return*/, res.json({ message: "Note Deleted!" })];
        }
    });
}); };
exports.deleteNote = deleteNote;
var updateNote = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, id, _a, title, content, note;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                id = req.params.id;
                _a = req.body, title = _a.title, content = _a.content;
                return [4 /*yield*/, Note_1.default.findOneAndUpdate({ _id: id, user: user._id }, { title: title, content: content }, { new: true })];
            case 1:
                note = _b.sent();
                if (!note)
                    return [2 /*return*/, res.status(404).json({ message: "Note not found" })];
                return [2 /*return*/, res.json(note)];
        }
    });
}); };
exports.updateNote = updateNote;
