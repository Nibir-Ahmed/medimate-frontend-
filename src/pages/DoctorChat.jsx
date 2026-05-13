import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, User, Users } from 'lucide-react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import ChatBox from '../components/ChatBox'

function DoctorChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const clientRef = useRef(null)
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    connect()
    return () => disconnect()
  }, [])

  const connect = () => {
    const client = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_WS_URL || 'http://localhost:3001/ws'),
      onConnect: () => {
        setConnected(true)

        // Online users subscribe
        client.subscribe('/topic/online-users', (message) => {
          const users = JSON.parse(message.body)
          setOnlineUsers([...users].filter(u => u !== user.name))
        })

        // Public channel subscribe
        client.subscribe('/topic/public', (message) => {
          const received = JSON.parse(message.body)
          setMessages(prev => [...prev, received])
        })

        // Join করো
        client.publish({
          destination: '/app/chat.addUser',
          body: JSON.stringify({
            senderName: user.name,
            type: 'JOIN'
          })
        })

        // Online users request করো
        client.publish({
          destination: '/app/chat.getOnlineUsers',
          body: JSON.stringify({})
        })
      },
      onDisconnect: () => setConnected(false)
    })
    client.activate()
    clientRef.current = client
  }

  const disconnect = () => {
    clientRef.current?.deactivate()
  }

  const selectUser = (targetUser) => {
    setSelectedUser(targetUser)
    setMessages([])

    // Private room subscribe
    const roomId = [user.name, targetUser].sort().join('_')
    clientRef.current.subscribe(`/topic/${roomId}`, (message) => {
      const received = JSON.parse(message.body)
      setMessages(prev => [...prev, received])
    })
  }

  const sendMessage = () => {
    if (!input.trim() || !connected) return

    const roomId = selectedUser
      ? [user.name, selectedUser].sort().join('_')
      : 'public'

    clientRef.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({
        senderName: user.name,
        receiverName: selectedUser,
        message: input,
        room: roomId,
        type: 'CHAT'
      })
    })
    setInput('')
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <MessageCircle size={32} /> Doctor Chat
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
            <span className="text-white/60 text-sm">{connected ? 'Connected' : 'Connecting...'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* Online Users Sidebar */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Users size={18} className="text-violet-400" />
              Online ({onlineUsers.length})
            </h3>

            {onlineUsers.length === 0 ? (
              <p className="text-white/40 text-sm text-center py-4">কেউ online নেই</p>
            ) : (
              <div className="flex flex-col gap-2">
                {onlineUsers.map((u, i) => (
                  <button
                    key={i}
                    onClick={() => selectUser(u)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-left ${selectedUser === u ? 'bg-violet-500/30 border border-violet-500/50' : 'hover:bg-white/10'}`}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {u?.charAt(0).toUpperCase()}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white/10"></span>
                    </div>
                    <span className="text-white text-sm">{u}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            {selectedUser ? (
              <div>
                {/* Selected User Header */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 mb-3 flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedUser?.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white/10"></span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{selectedUser}</p>
                    <p className="text-green-400 text-xs">Online</p>
                  </div>
                </div>

                <ChatBox
                  messages={messages}
                  input={input}
                  setInput={setInput}
                  sendMessage={sendMessage}
                  connected={connected}
                  currentUser={user?.name}
                />
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl h-full min-h-96 flex items-center justify-center">
                <div className="text-center">
                  <User size={48} className="text-white/20 mx-auto mb-3" />
                  <p className="text-white/40">বাম পাশ থেকে কাউকে select করুন</p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Current User Info */}
        <div className="mt-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-3">
          <User size={18} className="text-violet-400" />
          <p className="text-white/60 text-sm">আপনি <span className="text-violet-400 font-medium">{user?.name}</span> হিসেবে logged in আছেন।</p>
        </div>

      </div>
    </div>
  )
}

export default DoctorChat