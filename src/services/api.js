const BASE_URL = "http://localhost:8080/api"

export const registerUser = async (name, email, password, role) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password, role })
    })
    return response.json()
}

export const loginUser = async (email, password) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    return response.json()
}
export const getAllPosts = async () => {
    const response = await fetch(`${BASE_URL}/posts`)
    return response.json()
}

export const createPost = async (title, content, authorName) => {
    const response = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content, authorName })
    })
    return response.json()
}