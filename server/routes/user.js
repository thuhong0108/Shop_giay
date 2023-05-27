import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// GET ALL USERS
router.get('/', async (req, res) => {
    try {
        let users = await User.find()

        res.status(200).json({ 
            success: true, 
            message: 'Get all users successfully!', 
            data: users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

// GET USER
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        res.status(200).json({ 
            success: true, 
            message: 'Get user successfully!', 
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

// EDIT USER
router.put('/:id', async (req, res) => {
    try {
        const userUpdated = await User.findOneAndUpdate(
            { _id: req.params.id },
            { ...req.body },
            { new: true }
        )
        
        res.status(200).json({ 
            success: true, 
            message: 'Update user successfully!', 
            data: userUpdated
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})


export default router