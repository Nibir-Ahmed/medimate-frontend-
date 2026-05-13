import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

// Initialize database tables
export const initDB = async () => {
    try {
        const conn = await pool.getConnection()

        await conn.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('patient', 'doctor', 'admin') DEFAULT 'patient',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)

        await conn.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(500) NOT NULL,
                content TEXT NOT NULL,
                author_name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)

        // Check if admin exists, if not create one
        const [admins] = await conn.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
        if (admins.length === 0) {
            const bcrypt = await import('bcryptjs')
            const hashedPassword = await bcrypt.default.hash('admin123', 10)
            await conn.query(
                "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')",
                ['Admin', 'admin@medimate.com', hashedPassword]
            )
            console.log('✅ Default admin created: admin@medimate.com / admin123')
        }

        conn.release()
        console.log('✅ Database tables initialized')
    } catch (err) {
        console.error('❌ Database init error:', err.message)
        throw err
    }
}

export default pool
