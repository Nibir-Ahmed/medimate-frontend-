import express from 'express'
import cors from 'cors'
import http from 'http'
import dotenv from 'dotenv'
import { initDB } from './config/db.js'
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'
import adminRoutes from './routes/admin.js'
import { setupWebSocket } from './ws/chat.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/admin', adminRoutes)

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'MediMate Backend is running 🏥', timestamp: new Date().toISOString() })
})

// Create HTTP server (needed for WebSocket)
const server = http.createServer(app)

// Setup WebSocket
setupWebSocket(server)

// Initialize DB and start server
const start = async () => {
    try {
        await initDB()
        server.listen(PORT, () => {
            console.log(`\n🚀 MediMate Backend running on http://localhost:${PORT}`)
            console.log(`📡 WebSocket available at http://localhost:${PORT}/ws`)
            console.log(`📋 API endpoints:`)
            console.log(`   POST /api/auth/register`)
            console.log(`   POST /api/auth/login`)
            console.log(`   GET  /api/posts`)
            console.log(`   POST /api/posts`)
            console.log(`   GET  /api/admin/stats`)
            console.log(`   GET  /api/admin/users`)
            console.log(`   GET  /api/admin/posts\n`)
        })
    } catch (err) {
        console.error('❌ Failed to start server:', err.message)
        process.exit(1)
    }
}

start()
