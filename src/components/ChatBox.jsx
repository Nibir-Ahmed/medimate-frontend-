import { useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

function ChatBox({ messages, input, setInput, sendMessage, connected, currentUser }) {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden">

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-6 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center h-full">
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
                <div className={`flex gap-3 ${msg.senderName === currentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {msg.senderName?.charAt(0).toUpperCase()}
                  </div>
                  <div className={`max-w-xs flex flex-col ${msg.senderName === currentUser ? 'items-end' : 'items-start'}`}>
                    <span className="text-white/40 text-xs mb-1">{msg.senderName}</span>
                    <div className={`px-4 py-2 rounded-2xl text-white text-sm ${msg.senderName === currentUser ? 'bg-gradient-to-r from-violet-600 to-purple-600 rounded-tr-sm' : 'bg-white/20 rounded-tl-sm'}`}>
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
  )
}

export default ChatBox