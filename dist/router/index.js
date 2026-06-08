"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import Gtk from '../controllers/gtk';
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const middlewares_1 = __importDefault(require("../middlewares"));
const registration_controller_1 = __importDefault(require("../controllers/registration.controller"));
// import { handleImage } from '../utils';
// import UserMiddleware from '../middlewares/user';
const router = express_1.default.Router();
const baseUrl = '/api';
const userUrl = `${baseUrl}/user`;
const registrationUrl = `${baseUrl}/registration`;
// FOR ADMIN
// router.get(`${userUrl}/:id`, UserMiddleware.verifyToken, UserMiddleware.isAdmin, User.getUserById);
router.post(`${userUrl}`, user_controller_1.default.register);
// router.get(`${userUrl}`, UserMiddleware.verifyToken, UserMiddleware.isAdmin, User.listUser);
// router.delete(`${userUrl}/:id`, UserMiddleware.verifyToken, UserMiddleware.isAdmin, User.deleteUserById);
router.post(`${baseUrl}/login`, user_controller_1.default.login);
router.post(`${baseUrl}/logout`, middlewares_1.default.verifyToken, user_controller_1.default.logout);
// router.patch(`${userUrl}/:id`, UserMiddleware.verifyToken, UserMiddleware.isAdmin, handleImage, User.updateUserById);
// PPDB
router.post(`${registrationUrl}`, registration_controller_1.default.register);
router.get(`${registrationUrl}`, middlewares_1.default.verifyToken, middlewares_1.default.isAdmin, registration_controller_1.default.getAll);
router.get(`${registrationUrl}/count`, registration_controller_1.default.getTotalCount);
router.get(`${registrationUrl}/:id`, registration_controller_1.default.getById);
router.patch(`${registrationUrl}/:id`, middlewares_1.default.verifyToken, middlewares_1.default.isAdmin, registration_controller_1.default.updateStatus);
// GET GTK DATA
// router.get(`${gtkUrl}`, Gtk.listGtk);
// router.get(`${gtkUrl}/:id`, Gtk.getGtkById);
// router.post(`${gtkUrl}`, handleImage, Gtk.createGtk);
// router.patch(`${gtkUrl}/:id`, handleImage, Gtk.updateGtk);
// router.delete(`${gtkUrl}/:id`, Gtk.deleteGtkById);
exports.default = router;
