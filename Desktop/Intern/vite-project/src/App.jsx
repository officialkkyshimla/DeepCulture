import { useState } from 'react'
import './App.css'

function App() {
  const [transcript, setTranscript] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      setError('Please paste a transcript before running analysis')
      return
    }

    setLoading(true)
    setError('')
    setAnalysis('')

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transcript })
      })

      const data = await response.json()


      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze transcript')
      }

      setAnalysis(data.analysis)
    } catch (err) {
      setError(err.message || 'Error connecting to server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="app">
      <header className="header">
        <h1>Supervisor Feedback Analyzer — Trinethra</h1>
      </header>
      <main className="main">
        <div className="input-section">
          <label htmlFor="transcript">Drop Your Transcript:</label>
          <textarea
            id="transcript"
            name="transcript"
            rows="10"
            placeholder="Paste your transcript here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          ></textarea>
          <button
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>
        <div className="results-section">
          <h2>Analysis Results:</h2>
          <div className="results-content">
            {error && <div className="error-message">{error}</div>}
            {analysis && <pre className="analysis-text">{analysis}</pre>}
            {!analysis && !error && <p className="placeholder-text">Results will appear here after analysis</p>}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
