import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Clients from "./pages/Clients.jsx";
import ClientDetails from "./pages/ClientDetails.jsx";
import Landing from "./pages/Landing.jsx";
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

// 🔹 Banner informativo no topo
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

function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <MvpBanner />
      <div className="app-container">
        <Routes>
          {/* 👉 Agora a Landing é a página inicial */}
          <Route path="/" element={<Landing />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
