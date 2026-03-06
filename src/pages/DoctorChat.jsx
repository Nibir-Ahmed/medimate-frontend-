import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, MessageCircle, User } from 'lucide-react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

function DoctorChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const clientRef = useRef(null)
  const messagesEndRef = useRef(null)
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage()
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

        {/* Chat Box */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden">

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 flex flex-col gap-3">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-white/40">কেউ এখনো message করেনি</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index}>
                  {msg.type === 'JOIN' || msg.type === 'LEAVE' ? (
                    <div className="text-center text-white/40 text-sm py-1">
                      {msg.type === 'JOIN' ? `${msg.senderName} joined` : `${msg.senderName} left`}
                    </div>
                  ) : (
                    <div className={`flex gap-3 ${msg.senderName === user.name ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {msg.senderName?.charAt(0).toUpperCase()}
                      </div>
                      <div className={`max-w-xs ${msg.senderName === user.name ? 'items-end' : 'items-start'} flex flex-col`}>
                        <span className="text-white/40 text-xs mb-1">{msg.senderName}</span>
                        <div className={`px-4 py-2 rounded-2xl text-white text-sm ${msg.senderName === user.name ? 'bg-gradient-to-r from-violet-600 to-purple-600 rounded-tr-sm' : 'bg-white/20 rounded-tl-sm'}`}>
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/20 flex gap-3">
            <input
              type="text"
              placeholder="Message লিখুন..."
              className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-400 transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={sendMessage}
              disabled={!connected || !input.trim()}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-5 rounded-2xl transition-all shadow-lg shadow-violet-900/50 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

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