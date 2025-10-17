import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Clients from "./pages/Clients.jsx";
import ClientDetails from "./pages/ClientDetails.jsx";
import Landing from "./pages/Landing.jsx";
import "./index.css";

// 🔹 Cabeçalho superior
function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <span style={{ fontSize: 22 }}>💠</span>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#111827",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          Pix Automático
        </Link>
      </div>
    </div>
  );
}

// 🔹 Banner informativo (abaixo do topo)
function MvpBanner() {
  return (
    <div
      style={{
        background: "#fef9c3",
        color: "#92400e",
        textAlign: "center",
        padding: "8px 12px",
        fontSize: "14px",
        fontWeight: 500,
        borderBottom: "1px solid #fcd34d",
      }}
    >
      ⚡ Versão MVP em testes — dados e cadastros podem ser apagados a qualquer momento.
    </div>
  );
}

// 🔹 Rodapé (visível em todas as páginas)
function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#ecfdf5",
        color: "#065f46",
        textAlign: "center",
        padding: "14px 0",
        fontSize: 14,
        fontWeight: 500,
        borderTop: "1px solid #d1fae5",
        marginTop: "40px",
      }}
    >
      💚 <strong>Pix Automático</strong> — Projeto Beta Validando Ideia • Feito no Brasil 🇧🇷
    </footer>
  );
}

// 🔹 App principal
function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <MvpBanner />
      <div className="app-container">
        <Routes>
          {/* Landing page inicial */}
          <Route path="/" element={<Landing />} />
          {/* Tabela de clientes */}
          <Route path="/clients" element={<Clients />} />
          {/* Detalhes do cliente */}
          <Route path="/clients/:id" element={<ClientDetails />} />
        </Routes>
      </div>
      <Footer /> {/* 👈 aparece em todas as páginas */}
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
