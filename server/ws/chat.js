import sockjs from 'sockjs'

// Track online users and their connections
const onlineUsers = new Map()  // name -> Set of connections
const subscriptions = new Map()  // connectionId -> Map of destination -> true

let connectionIdCounter = 0

// Parse STOMP frame from raw data
function parseStompFrame(data) {
    const lines = data.split('\n')
    const command = lines[0]
    const headers = {}
    let i = 1

    while (i < lines.length && lines[i] !== '') {
        const colonIndex = lines[i].indexOf(':')
        if (colonIndex > 0) {
            headers[lines[i].substring(0, colonIndex)] = lines[i].substring(colonIndex + 1)
        }
        i++
    }
    i++ // skip empty line

    const body = lines.slice(i).join('\n').replace(/\0$/, '')
    return { command, headers, body }
}

// Create STOMP frame string
function createStompFrame(command, headers = {}, body = '') {
    let frame = command + '\n'
    for (const [key, value] of Object.entries(headers)) {
        frame += `${key}:${value}\n`
    }
    frame += '\n' + body + '\0'
    return frame
}

// Broadcast to all connections subscribed to a destination
function broadcast(destination, body) {
    for (const [connId, subs] of subscriptions.entries()) {
        if (subs.has(destination)) {
            const conn = subs.get(destination)
            try {
                conn.write(createStompFrame('MESSAGE', {
                    destination,
                    'content-type': 'application/json'
                }, body))
            } catch (e) {
                // Connection might be closed
            }
        }
    }
}

// Broadcast online users list
function broadcastOnlineUsers() {
    const userNames = Array.from(onlineUsers.keys())
    broadcast('/topic/online-users', JSON.stringify(userNames))
}

export function setupWebSocket(server) {
    const ws = sockjs.createServer({
        prefix: '/ws',
        log: () => {}
    })

    ws.on('connection', (conn) => {
        const connId = ++connectionIdCounter
        let userName = null
        subscriptions.set(connId, new Map())

        conn.on('data', (rawData) => {
            try {
                const frame = parseStompFrame(rawData)

                switch (frame.command) {
                    case 'CONNECT': {
                        conn.write(createStompFrame('CONNECTED', {
                            version: '1.1',
                            'heart-beat': '0,0'
                        }))
                        break
                    }

                    case 'SUBSCRIBE': {
                        const destination = frame.headers.destination
                        if (destination) {
                            const subs = subscriptions.get(connId)
                            subs.set(destination, conn)
                        }
                        break
                    }

                    case 'SEND': {
                        const destination = frame.headers.destination
                        const body = frame.body

                        if (destination === '/app/chat.addUser') {
                            const msg = JSON.parse(body)
                            userName = msg.senderName
                            if (!onlineUsers.has(userName)) {
                                onlineUsers.set(userName, new Set())
                            }
                            onlineUsers.get(userName).add(connId)

                            // Broadcast join message to public
                            broadcast('/topic/public', JSON.stringify({
                                senderName: userName,
                                type: 'JOIN',
                                message: `${userName} joined the chat`
                            }))

                            broadcastOnlineUsers()
                        }
                        else if (destination === '/app/chat.getOnlineUsers') {
                            broadcastOnlineUsers()
                        }
                        else if (destination === '/app/chat.sendMessage') {
                            const msg = JSON.parse(body)
                            const targetTopic = msg.room === 'public'
                                ? '/topic/public'
                                : `/topic/${msg.room}`
                            broadcast(targetTopic, JSON.stringify(msg))
                        }
                        break
                    }

                    case 'DISCONNECT': {
                        // handled in conn.on('close')
                        break
                    }
                }
            } catch (err) {
                console.error('WebSocket message error:', err)
            }
        })

        conn.on('close', () => {
            subscriptions.delete(connId)

            if (userName && onlineUsers.has(userName)) {
                onlineUsers.get(userName).delete(connId)
                if (onlineUsers.get(userName).size === 0) {
                    onlineUsers.delete(userName)

                    // Broadcast leave message
                    broadcast('/topic/public', JSON.stringify({
                        senderName: userName,
                        type: 'LEAVE',
                        message: `${userName} left the chat`
                    }))

                    broadcastOnlineUsers()
                }
            }
        })
    })

    ws.installHandlers(server)
    console.log('✅ WebSocket (SockJS/STOMP) server ready at /ws')
}
