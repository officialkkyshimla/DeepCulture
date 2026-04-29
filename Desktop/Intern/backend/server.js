import express, { response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;
// const OLLAMA_API = 'http://localhost:11434/api/generate';

// Middleware
app.use(express.json());
app.use(cors());

// API endpoint to analyze transcript
app.post('/api/analyze', async (req, res) => {
    const {transcript} = req.body;
    console.log('Received transcript:', transcript);
    if (!transcript || !transcript.trim()) {
        return res.status(400).json({ error: 'Transcript is required' });
    }

    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.2',
                prompt: transcript,
                stream: false
            })
        });
        const data = await response.json();
        console.log(data.response); // The model's output
        if (typeof data.response === 'undefined' || data.response === null) {
            return res.status(502).json({ error: 'No analysis response from Ollama API' });
        }
        res.json({ analysis: data.response });
    } catch (error) {
        console.error('Error analyzing transcript:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    //console.log(`Ollama API: ${OLLAMA_API}`);
});     