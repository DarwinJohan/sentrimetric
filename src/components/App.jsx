import React, { useState } from 'react';
import "./App.css"
export default function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult({ hate: data.isHateSpeech, message: data.result });
    } catch (error) {
      setResult({ hate: false, message: 'Error occured, please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main>
        <h1>Hate Speech Detector</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Please input sentence..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
          />
          <button type="submit">Detect</button>
        </form>

        {!loading && result && (
          <p className="result-text" style={{ color: result.hate ? '#ff5555' : '#55ff55' }}
          >
            {result.message}
          </p>
        )}
      </main>

      {/* Modal Loading */}
      <div className={`modal-overlay ${loading ? 'active' : ''}`} aria-hidden={!loading}>
        <div className="modal" role="alert" aria-live="assertive">
          <div className="spinner" aria-label="Loading spinner"></div>
          <p>Processing, please wait...</p>
        </div>
      </div>

      {/* Modal Result */}
      <div className={`modal-overlay ${!loading && result ? 'active' : ''}`} aria-hidden={loading || !result}
      >

        <div className={`modal ${result?.hate === true ? 'hate' : 'safe'}`} role="alert">
          <button className="modal-close-btn" onClick={() => setResult(null)}>&times;</button>
          <div className={`modal-icon ${result?.hate ? 'warning' : 'check'}`} aria-hidden="true">
            {result?.hate ? '⚠️' : '✅'}
          </div>
          <p>{result?.message}</p>
        </div>

      </div>
    </>
  );
}
