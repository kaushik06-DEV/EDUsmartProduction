// server.js

const express = require('express');
const cors = require('cors');
// We need dotenv again for the new API key
require('dotenv').config();
// Polyfill fetch for Node < 18
if (typeof fetch === 'undefined') {
  global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}
const { connectToDatabase } = require('./config/db');
const certificatesRouter = require('./routes/certificates');
const usersRouter = require('./routes/users');
const coursesRouter = require('./routes/courses');
const enrollmentsRouter = require('./routes/enrollments');
const hackathonsRouter = require('./routes/hackathons');
const bookRequestsRouter = require('./routes/bookRequests');
const notificationsRouter = require('./routes/notifications');
const userSettingsRouter = require('./routes/userSettings');
const authRouter = require('./routes/auth');
const ChatMessage = require('./models/ChatMessage');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());
// Ensure uploads directory exists and serve statically
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- MODIFICATION: Set up Cohere API details ---
const COHERE_API_KEY = process.env.COHERE_API_KEY;
const COHERE_API_ENDPOINT = "https://api.cohere.ai/v1/chat";

// Persisted chat history
app.get('/api/ai/chat/history', async (req, res) => {
  try {
    const { sessionId, userId, limit = 50 } = req.query;
    const filter = {};
    if (sessionId) filter.sessionId = sessionId;
    if (userId) filter.user = userId;
    const items = await ChatMessage.find(filter).sort({ createdAt: 1 }).limit(Number(limit));
    res.json(items);
  } catch (e) {
    console.error('History fetch failed:', e);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// --- MODIFICATION: The entire chat logic is also updated for Cohere ---
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt, history = [], sessionId, userId } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!COHERE_API_KEY) {
      return res.status(200).json({ text: 'AI is temporarily unavailable (missing API key). Please set COHERE_API_KEY and restart.' });
    }
    
    // --- IMPORTANT: Transform history for Cohere's format ---
    // Cohere expects roles 'USER' and 'CHATBOT'.
    const cohereChatHistory = history.map(msg => {
        return {
            role: msg.role === 'user' ? 'USER' : 'CHATBOT',
            message: msg.text
        };
    });

    // Make a POST request to the Cohere API
    const apiResponse = await fetch(COHERE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "command-a-03-2025", // A powerful and balanced model from Cohere
        message: prompt, // The user's latest message
        chat_history: cohereChatHistory, // The transformed history
        stream: false
      }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Cohere API Error:", errorText);
      return res.status(200).json({ text: 'AI is temporarily unavailable. Please try again later.' });
    }

    const responseData = await apiResponse.json();
    // The response format from Cohere has the text in the `text` key.
    const generatedText = responseData.text || responseData.message || '';

    // Persist messages if sessionId provided
    if (sessionId) {
      try {
        await ChatMessage.create({ sessionId, user: userId, role: 'user', text: prompt });
        await ChatMessage.create({ sessionId, user: userId, role: 'model', text: generatedText });
      } catch (e) {
        console.error('Failed to persist chat messages:', e);
      }
    }

    res.json({ text: (generatedText || 'AI did not return a response.').trim() });

  } catch (error) {
    console.error('Error in /api/ai/chat:', error);
    res.status(200).json({ text: 'AI is temporarily unavailable. Please try again later.' });
  }
});

// --- MODIFICATION: The quiz logic is also updated for Cohere ---
app.post('/api/ai/quiz', async (req, res) => {
    try {
        const { topic } = req.body;
        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        if (!COHERE_API_KEY) {
            return res.status(200).json({
                question: `Sample question about ${topic}?`,
                options: ["A", "B", "C", "D"],
                correctAnswerIndex: 0,
                explanation: "AI is offline; this is a placeholder."
            });
        }

        const prompt = `
          Generate a single, valid JSON object for a multiple choice quiz question about ${topic}.
          Do not include any other text, just the JSON.
          The JSON format must be:
          {
            "question": "The quiz question",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswerIndex": 0,
            "explanation": "A brief explanation of the correct answer."
          }
        `;

        const apiResponse = await fetch(COHERE_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${COHERE_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: "command-a-03-2025", message: prompt, stream: false }),
        });

        if (!apiResponse.ok) {
            return res.status(200).json({
                question: `Sample question about ${topic}?`,
                options: ["A", "B", "C", "D"],
                correctAnswerIndex: 0,
                explanation: "AI is temporarily unavailable; placeholder provided."
            });
        }

        const responseData = await apiResponse.json();
        const generatedText = responseData.text || '';

        const jsonResponse = JSON.parse(generatedText.trim());
        res.json(jsonResponse);

    } catch (error) {
        console.error('Error in /api/ai/quiz:', error);
        res.status(200).json({
            question: 'Sample question while AI is unavailable?',
            options: ["A", "B", "C", "D"],
            correctAnswerIndex: 0,
            explanation: 'Fallback content.'
        });
    }
});

async function ensureDefaultAdmin() {
  try {
    const phone = '9791761907';
    let admin = await User.findOne({ role: 'admin', 'profile.phone': phone });
    if (!admin) {
      const passwordHash = await bcrypt.hash('Qwerty@1212', 10);
      admin = await User.create({
        name: 'Administrator',
        email: undefined,
        passwordHash,
        role: 'admin',
        profile: { phone }
      });
      console.log('✅ Default admin created with phone 9791761907');
    } else {
      console.log('ℹ️ Default admin already exists');
    }
  } catch (e) {
    console.error('Failed to ensure default admin:', e);
  }
}

// Connect to Mongo and mount routes
connectToDatabase().then(async () => {
  await ensureDefaultAdmin();
  app.use('/api/auth', authRouter);
  app.use('/api/certificates', certificatesRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/courses', coursesRouter);
  app.use('/api/enrollments', enrollmentsRouter);
  app.use('/api/hackathons', hackathonsRouter);
  app.use('/api/book-requests', bookRequestsRouter);
  app.use('/api/notifications', notificationsRouter);
  app.use('/api/user-settings', userSettingsRouter);

  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start server due to DB error:', err);
  process.exit(1);
});