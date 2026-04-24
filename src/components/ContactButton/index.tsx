'use client';

import { useState } from "react";

import './style.css'

export default function ContactButton() {
  const [aberto, setAberto] = useState(false);

  return (
    <main>
      <button className="floating-btn" onClick={() => setAberto(true)}>
        Contato
      </button>

      {aberto && (
        <div
          className="contact-overlay ativo"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setAberto(false);
            }
          }}
        >
          <div className="contact-box">
            <span
              className="floating-btn"
              onClick={() => setAberto(false)}
            >
              Fechar Contato
            </span>

            <iframe
              src="https://contato-2ayg.onrender.com"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>
      )}

      <footer>
        <p>&copy; 2026 app_contato. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
