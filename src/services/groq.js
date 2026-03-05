const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

export const analyzeSymptoms = async (symptoms, imageBase64 = null) => {
    const messages = [
        {
            role: "user",
            content: `তুমি একজন অভিজ্ঞ ডাক্তার। নিচের symptoms দেখে বাংলায় পরামর্শ দাও।

Symptoms: ${symptoms}

নিচের format এ উত্তর দাও:
1. সম্ভাব্য সমস্যা কী
2. প্রাথমিক করণীয়
3. কখন ডাক্তার দেখাতে হবে
4. সতর্কতা

(এটি শুধু প্রাথমিক পরামর্শ, সঠিক চিকিৎসার জন্য অবশ্যই ডাক্তার দেখান)`
        }
    ]

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: messages,
            max_tokens: 1024
        })
    })

    const data = await response.json()
    return data.choices[0].message.content
}