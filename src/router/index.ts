import express from 'express';
// import Gtk from '../controllers/gtk';
import User from '../controllers/user.controller';
import UserMiddleware from '../middlewares';
import RegistrationController from '../controllers/registration.controller';
// import { handleImage } from '../utils';
// import UserMiddleware from '../middlewares/user';

const router = express.Router();
const baseUrl = '/api';
const userUrl = `${baseUrl}/user`;
const registrationUrl = `${baseUrl}/registration`;

// FOR ADMIN
// router.get(`${userUrl}/:id`, UserMiddleware.verifyToken, UserMiddleware.isAdmin, User.getUserById);
router.post(`${userUrl}`, User.register);
// router.get(`${userUrl}`, UserMiddleware.verifyToken, UserMiddleware.isAdmin, User.listUser);
// router.delete(`${userUrl}/:id`, UserMiddleware.verifyToken, UserMiddleware.isAdmin, User.deleteUserById);
router.post(`${baseUrl}/login`, User.login);
router.post(`${baseUrl}/logout`, UserMiddleware.verifyToken, User.logout);
// router.patch(`${userUrl}/:id`, UserMiddleware.verifyToken, UserMiddleware.isAdmin, handleImage, User.updateUserById);

// PPDB
router.post(
  `${registrationUrl}`,
  RegistrationController.register
);

router.get(
  `${registrationUrl}`, UserMiddleware.verifyToken, UserMiddleware.isAdmin,
  RegistrationController.getAll
);

router.get(
  `${registrationUrl}/:id`,
  RegistrationController.getById
);

router.patch(
  `${registrationUrl}/:id`,
  UserMiddleware.verifyToken, UserMiddleware.isAdmin,
  RegistrationController.updateStatus
);

// GET GTK DATA
// router.get(`${gtkUrl}`, Gtk.listGtk);
// router.get(`${gtkUrl}/:id`, Gtk.getGtkById);
// router.post(`${gtkUrl}`, handleImage, Gtk.createGtk);
// router.patch(`${gtkUrl}/:id`, handleImage, Gtk.updateGtk);
// router.delete(`${gtkUrl}/:id`, Gtk.deleteGtkById);

export default router;