// frontend/src/pages/Landing.jsx
import React from "react";

export default function Landing() {
  return (
    <main
      style={{
        backgroundColor: "#e7f5f0",
        color: "#111827",
        minHeight: "100vh",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
      }}
    >
      {/* 🔹 Header com imagem da marca */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#e7f5f0",
          display: "flex",
          justifyContent: "center",
          padding: "32px 0 20px 0",
        }}
      >
        <img
          src="/pix-automatico-header.png"
          alt="Pix Automático — Automatize suas cobranças. Poupe tempo."
          style={{
            maxWidth: "480px",
            width: "80%",
            height: "auto",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        />
      </div>

      {/* 🔸 Título principal */}
      <section style={{ textAlign: "center", padding: "20px 16px 10px 16px" }}>
        <h2
          style={{
            color: "#15803d",
            fontSize: "28px",
            marginBottom: "8px",
            fontWeight: 700,
          }}
        >
          Pix Automático — Beta Público
        </h2>
        <p
          style={{
            fontSize: "18px",
            color: "#374151",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Automação de cobranças via Pix, simples e inteligente.
        </p>
        <p
          style={{
            color: "#4b5563",
            fontSize: "16px",
            marginTop: "12px",
            lineHeight: "1.6",
          }}
        >
          Teste gratuitamente o sistema que permite gerenciar clientes,
          gerar cobranças recorrentes e automatizar reembolsos — tudo 100% via Pix.
        </p>

        {/* 🚀 Botão principal */}
        <a
          href="/clients"
          style={{
            display: "inline-block",
            background: "#38b49c",
            color: "#fff",
            padding: "12px 28px",
            borderRadius: 12,
            textDecoration: "none",
            fontSize: 18,
            fontWeight: 600,
            marginTop: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          🚀 Acessar o Sistema
        </a>

        {/* ⚠️ Aviso Beta */}
        <div
          style={{
            marginTop: "16px",
            background: "#fff8e1",
            border: "1px solid #fcd34d",
            borderRadius: "8px",
            padding: "10px 16px",
            maxWidth: "480px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <p
            style={{
              color: "#92400e",
              fontSize: "14px",
              margin: 0,
              textAlign: "center",
              lineHeight: "1.5",
            }}
          >
            ⚠️ Esta é uma versão <b>beta</b> para validação da ideia.
            <br />
            Algumas funções (como o débito automático futuro) ainda estão em desenvolvimento.
          </p>
        </div>
      </section>

      {/* 💻 Demonstração do Sistema */}
<section
  style={{
    background: "#f7f8fa",
    padding: "60px 16px",
    textAlign: "center",
    borderTop: "1px solid #e5e7eb",
  }}
>
  <h3 style={{ color: "#15803d", fontSize: "24px", fontWeight: 700 }}>
    ⚙️ Veja o Pix Automático em ação
  </h3>
  <p
    style={{
      color: "#4b5563",
      maxWidth: "600px",
      margin: "10px auto 40px auto",
      fontSize: "16px",
    }}
  >
    Interface responsiva — totalmente compatível com computadores e celulares.
  </p>

  {/* 💻 VERSÃO DESKTOP */}
  <h4
    style={{
      color: "#166534",
      fontSize: "20px",
      fontWeight: 600,
      marginBottom: "20px",
      marginTop: "20px",
    }}
  >
    💻 Versão Desktop
  </h4>
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      marginBottom: "60px",
    }}
  >
    <img
      src="/screenshots/desktop-details.png"
      alt="Tela de autorizações — versão desktop"
      style={{
        maxWidth: "80%",
        height: "auto",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        objectFit: "contain",
      }}
    />
  </div>

  {/* 📱 VERSÃO MOBILE */}
  <h4
    style={{
      color: "#166534",
      fontSize: "20px",
      fontWeight: 600,
      marginBottom: "20px",
    }}
  >
    📱 Versão Mobile
  </h4>
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "24px",
    }}
  >
    <img
      src="/screenshots/android-simple.png"
      alt="Tela Android — autorizações"
      style={{
        width: "220px",
        borderRadius: "24px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
      }}
    />
    <img
      src="/screenshots/iphone-simple.png"
      alt="Tela iPhone — clientes"
      style={{
        width: "220px",
        borderRadius: "24px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
      }}
    />
    <img
      src="/screenshots/Android Phone Client Status.png"
      alt="Tela Android — lista de clientes"
      style={{
        width: "220px",
        borderRadius: "24px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
      }}
    />
    <img
      src="/screenshots/android-reembolsar.png"
      alt="Tela Android — tela de reembolso"
      style={{
        width: "220px",
        borderRadius: "24px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
      }}
    />
  </div>
</section>

      {/* 💬 Seção de feedback */}
      <section
        id="feedback"
        style={{
          background: "#ffffff",
          marginTop: "40px",
          padding: "40px 16px",
          borderTop: "2px solid #d1fae5",
          scrollMarginTop: "100px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h3 style={{ color: "#15803d", fontSize: "22px", fontWeight: 600 }}>
            💬 Envie seu feedback
          </h3>
          <p
            style={{
              color: "#4b5563",
              maxWidth: "600px",
              margin: "8px auto",
              fontSize: "15px",
            }}
          >
            Sua opinião é essencial para melhorarmos o Pix Automático.
            <br />
            O formulário abaixo leva menos de 2 minutos:
          </p>
        </div>

        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSekXHxfQmo1Xlk3F5RR3tKncUitDLSlRr7jGOckP14uFjaOxw/viewform?embedded=true"
            width="100%"
            height="1200"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Feedback Pix Automático"
          >
            Carregando formulário…
          </iframe>
        </div>
      </section>
    </main>
  );
}
