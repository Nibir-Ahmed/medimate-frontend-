import { Router } from 'express'
import bcrypt from 'bcryptjs'
import pool from '../config/db.js'

const router = Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        // Check if email already exists
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email already registered' })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Insert user
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'patient']
        )

        res.json({
            id: result.insertId,
            name,
            email,
            role: role || 'patient'
        })
    } catch (err) {
        console.error('Register error:', err)
        res.status(500).json({ error: 'Registration failed' })
    }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        const user = users[0]
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        })
    } catch (err) {
        console.error('Login error:', err)
        res.status(500).json({ error: 'Login failed' })
    }
})

export default router
