import { Router } from 'express'
import pool from '../config/db.js'

const router = Router()

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
    try {
        const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users')
        const [[{ totalDoctors }]] = await pool.query("SELECT COUNT(*) AS totalDoctors FROM users WHERE role = 'doctor'")
        const [[{ totalPatients }]] = await pool.query("SELECT COUNT(*) AS totalPatients FROM users WHERE role = 'patient'")
        const [[{ totalPosts }]] = await pool.query('SELECT COUNT(*) AS totalPosts FROM posts')

        res.json({ totalUsers, totalDoctors, totalPatients, totalPosts })
    } catch (err) {
        console.error('Stats error:', err)
        res.status(500).json({ error: 'Failed to fetch stats' })
    }
})

// GET /api/admin/users
router.get('/users', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role, created_at AS createdAt FROM users ORDER BY created_at DESC')
        res.json(users)
    } catch (err) {
        console.error('Get users error:', err)
        res.status(500).json({ error: 'Failed to fetch users' })
    }
})

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id])
        res.json({ success: true })
    } catch (err) {
        console.error('Delete user error:', err)
        res.status(500).json({ error: 'Failed to delete user' })
    }
})

// GET /api/admin/posts
router.get('/posts', async (req, res) => {
    try {
        const [posts] = await pool.query(
            'SELECT id, title, content, author_name AS authorName, created_at AS createdAt FROM posts ORDER BY created_at DESC'
        )
        res.json(posts)
    } catch (err) {
        console.error('Get posts error:', err)
        res.status(500).json({ error: 'Failed to fetch posts' })
    }
})

// DELETE /api/admin/posts/:id
router.delete('/posts/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id])
        res.json({ success: true })
    } catch (err) {
        console.error('Delete post error:', err)
        res.status(500).json({ error: 'Failed to delete post' })
    }
})

export default router
