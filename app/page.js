'use client';

import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <main className="card">
      <h1>Selamat Datang!</h1>
      <p>Aplikasi web siap deploy ke Vercel via GitHub.</p>
      
      {submitted ? (
        <div style={{ color: '#4ade80', marginTop: '1rem' }}>
          Halo <strong>{name}</strong>, formulir berhasil dikirim!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Masukkan nama Anda..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit">Kirim Data</button>
        </form>
      )}
    </main>
  );
}
