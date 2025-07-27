import React, { useState } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/upload";

function App() {
  const [file, setFile] = useState(null);
  const [persona, setPersona] = useState('student');
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('persona', persona);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <h1>PDF Intelligence WebApp (Round 2)</h1>

      <label htmlFor="persona-select">Select Persona:</label>
      <select id="persona-select" value={persona} onChange={e => setPersona(e.target.value)}>
        <option value="student">Student</option>
        <option value="researcher">Researcher</option>
        <option value="executive">Executive</option>
      </select>

      <input
        type="file"
        accept=".pdf"
        onChange={e => { setFile(e.target.files[0]); setResult(null); setError(''); }}
      />

      <button onClick={uploadFile} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload & Extract'}
      </button>

      {error && <div className="error">{error}</div>}

      {result && (
        <div style={{ marginTop: "2rem", textAlign: "left" }}>
          <h2>Result</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
