import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, User } from 'lucide-react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import ChatBox from '../components/ChatBox'

function DoctorChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
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
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        setConnected(true)
        client.subscribe('/topic/public', (message) => {
          const received = JSON.parse(message.body)
          setMessages(prev => [...prev, received])
        })
        client.publish({
          destination: '/app/chat.addUser',
          body: JSON.stringify({
            senderName: user.name,
            type: 'JOIN'
          })
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

  const sendMessage = () => {
    if (!input.trim() || !connected) return
    clientRef.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({
        senderName: user.name,
        message: input,
        type: 'CHAT'
      })
    })
    setInput('')
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">

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

        {/* ChatBox Component */}
        <ChatBox
          messages={messages}
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          connected={connected}
          currentUser={user?.name}
        />

        {/* Info */}
        <div className="mt-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-3">
          <User size={18} className="text-violet-400" />
          <p className="text-white/60 text-sm">আপনি <span className="text-violet-400 font-medium">{user?.name}</span> হিসেবে logged in আছেন। দুটো browser tab খুলে test করুন!</p>
        </div>

      </div>
    </div>
  )
}

export default DoctorChat