import express from 'express';
const router = express.Router();

import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get("/allusers", getAllUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/deleteuser/:id', deleteUser);

export default router;