import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Clients from "./pages/Clients.jsx";
import ClientDetails from "./pages/ClientDetails.jsx";
import "./index.css";

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

// 🔹 Novo componente do banner MVP
function MvpBanner() {
  return (
    <div
      style={{
        background: "#fef9c3", // amarelo claro
        color: "#92400e", // marrom suave
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

function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <MvpBanner /> {/* 👈 Banner aqui, logo abaixo do topo */}
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// --- Deletar cliente ---
export async function deleteClient(clientId) {
  const res = await fetch(`${API_BASE}/api/clients/${clientId}`, {
    method: "DELETE",
  });
  return res.json();
}

// --- Deletar autorização ---
export async function deleteAuthorization(authId) {
  const res = await fetch(`${API_BASE}/api/authorizations/${authId}`, {
    method: "DELETE",
  });
  return res.json();
}

createRoot(document.getElementById("root")).render(<App />);
