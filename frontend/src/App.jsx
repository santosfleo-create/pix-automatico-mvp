// src/App.jsx
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Clients from "./pages/Clients.jsx";
import ClientDetails from "./pages/ClientDetails.jsx";
import Landing from "./pages/Landing.jsx";
import "./index.css";

/* ───────────────────────────────── TopBar ───────────────────────────────── */
function TopBar() {
  return (
    <div className="topbar">
      <div
        className="topbar-inner"
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <img src="/pix.png" alt="Pix Automático Logo" style={{ width: 28, height: 28 }} />
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

/* ──────────────────────────────── MvpBanner ─────────────────────────────── */
function MvpBanner() {
  return (
    <div
      style={{
        backgroundColor: "#fff7cc",
        color: "#6b5000",
        textAlign: "center",
        padding: "8px 12px",
        fontSize: "14px",
        fontWeight: 500,
        borderBottom: "1px solid #f2e8a0",
      }}
    >
      ⚡ Versão pública de demonstração — Após adicionar o primeiro cliente, aguarde até 30 segundos. O sistema está em fase de testes e alguns dados podem ser apagados.
    </div>
  );
}

/* ──────────────────────────────── Footer ────────────────────────────────── */
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
        marginTop: 40,
      }}
    >
      💚 <strong>Pix Automático</strong> — Projeto Beta Público © 2025 • De brasileiro para brasileiros 🇧🇷
    </footer>
  );
}

/* ───────────────────── Scroll automático para o #hash ────────────────────
   Quando navegamos para "/#feedback" a Landing precisa montar primeiro.
   Este componente observa a URL (pathname + hash) e faz o scroll assim que a
   tela atualiza. */
function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");

    // aguarda renderização completa da Landing
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 120; // offset do topo fixo
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 700); // espera 0.7s para garantir render do conteúdo

    return () => clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return null;
}

/* ───────────────────── Botão flutuante de Feedback ─────────────────────── */
function FeedbackFab() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Função auxiliar para enviar o evento GA4
  function trackFeedbackClick() {
    if (window.gtag) {
      window.gtag("event", "feedback_click", {
        event_category: "CTA",
        event_label: "Botão flutuante Feedback",
        value: 1,
      });
      console.log("📊 GA4 event enviado: feedback_click");
    } else {
      console.warn("⚠️ gtag não encontrado — GA4 ainda não carregou.");
    }
  }

  function handleClick(e) {
    e.preventDefault();
    trackFeedbackClick(); // envia o evento

    if (location.pathname === "/") {
      // já está na Landing → só faz scroll
      const el = document.getElementById("feedback");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // outra rota → navega até /#feedback (ScrollToHash cuida do scroll)
      navigate("/#feedback");
    }
  }

  return (
    <a
      href="/#feedback"
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: "linear-gradient(135deg, #38b49c, #2d937f)",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: 30,
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        fontWeight: 500,
        fontSize: 14,
        textDecoration: "none",
        zIndex: 1000,
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
    >
      💬 Feedback
    </a>
  );
}

/* ─────────────────────────────────── App ────────────────────────────────── */
function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <MvpBanner />
      <ScrollToHash />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientDetails />} />
        </Routes>
      </div>
      <FeedbackFab />
      <Footer />
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
