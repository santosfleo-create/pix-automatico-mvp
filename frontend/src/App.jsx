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
      <div className="topbar-inner" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <img
          src="/pix.png"
          alt="Pix Automático Logo"
          style={{ width: "28px", height: "28px" }}
        />
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
        backgroundColor: "#fff7cc", // amarelo mais suave
        color: "#6b5000",            // marrom mais elegante
        textAlign: "center",
        padding: "8px 12px",
        fontSize: "14px",
        fontWeight: 500,
        borderBottom: "1px solid #f2e8a0", // borda sutil
      }}
    >
      ⚡ Versão pública de demonstração — O sistema está em fase de testes e alguns dados podem ser apagados.
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
      💚 <strong>Pix Automático</strong> — Projeto Beta Público © 2025 • Feito no Brasil 🇧🇷
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

{/* 🔹 Botão flutuante de feedback */}
<a
  href="/#feedback"
  style={{
    position: "fixed",
    bottom: "24px",
    right: "24px",
    background: "linear-gradient(135deg, #38b49c, #2d937f)",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "30px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    fontWeight: "500",
    fontSize: "14px",
    textDecoration: "none",
    zIndex: 1000,
    transition: "all 0.2s ease",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
>
  💬 Feedback
</a>

<Footer /> {/* 👈 aparece em todas as páginas */} </BrowserRouter> ); }

createRoot(document.getElementById("root")).render(<App />);
