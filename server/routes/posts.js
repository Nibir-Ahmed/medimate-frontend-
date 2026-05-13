import { Router } from 'express'
import pool from '../config/db.js'

const router = Router()

// GET /api/posts
router.get('/', async (req, res) => {
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

// POST /api/posts
router.post('/', async (req, res) => {
    try {
        const { title, content, authorName } = req.body

        const [result] = await pool.query(
            'INSERT INTO posts (title, content, author_name) VALUES (?, ?, ?)',
            [title, content, authorName]
        )

        res.json({
            id: result.insertId,
            title,
            content,
            authorName,
            createdAt: new Date().toISOString()
        })
    } catch (err) {
        console.error('Create post error:', err)
        res.status(500).json({ error: 'Failed to create post' })
    }
})

export default router
