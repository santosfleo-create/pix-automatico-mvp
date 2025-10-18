import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listClients, createClient, deleteClient } from "../api.js";

function formatDateTime(dateString) {
  if (!dateString) return "—";
  let date;
  if (!isNaN(Date.parse(dateString))) {
    date = new Date(dateString);
  } else {
    const clean = String(dateString).replace(",", "");
    const parts = clean.split(" ");
    const [day, month, year] = parts[0].split("/").map(Number);
    const [hour = 0, minute = 0] = (parts[1]?.split(":") || []).map(Number);
    date = new Date(year, month - 1, day, hour, minute);
  }
  if (isNaN(date.getTime())) return "—";
  const data = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const hora = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${data} às ${hora}`;
}

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  // 🧩 Corrige scroll: remove só se conteúdo couber na tela
  useEffect(() => {
    const checkScroll = () => {
      const contentHeight = document.body.scrollHeight;
      const windowHeight = window.innerHeight;
      if (contentHeight <= windowHeight) {
        document.body.style.overflowY = "hidden";
      } else {
        document.body.style.overflowY = "auto";
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);

    return () => {
      document.body.style.overflowY = "auto";
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  async function refresh() {
    const data = await listClients();
    setClients(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  // ✅ nome certo da função
  async function addClient() {
    if (!name.trim()) return alert("Informe o nome do cliente.");
    await createClient(name.trim());
    setName("");
    refresh();
  }

  return (
    <div className="spacer-top">
      <div
        className="card container-narrow"
        style={{
          width: "900px",
          maxWidth: "95%",
          padding: "40px 50px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Clientes</h2>

        {/* Campo + Botão */}
        <div
          className="form-row"
          style={{
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <input
            className="input"
            placeholder="Nome do cliente"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addClient()}
            style={{ minWidth: 220 }}
          />
          <button
            style={{
              backgroundColor: "#38b49c",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              transition: "background 0.2s",
            }}
            onClick={addClient} // 👈 corrigido
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#2e9b85")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#38b49c")}
          >
            Adicionar
          </button>
        </div>

        {/* Lista */}
        {clients.length === 0 ? (
          <p style={{ textAlign: "center", color: "#555", marginTop: 20 }}>
            Sem clientes. Adicione o seu primeiro cliente acima.
          </p>
        ) : (
          <div className="table-wrap section-sep">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cliente desde</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr
                    key={c.id}
                    className="row-click"
                    onClick={() => navigate(`/clients/${c.id}`)}
                  >
                    <td>{c.name}</td>
                    <td>{formatDateTime(c.createdAt)}</td>
                    <td>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (
                            window.confirm(
                              "Tem certeza que deseja deletar este cliente?"
                            )
                          ) {
                            await deleteClient(c.id);
                            await refresh();
                          }
                        }}
                        style={{
                          background: "#ef4444",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "6px 12px",
                          cursor: "pointer",
                          fontSize: "13px",
                          transition: "background 0.3s ease",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.background = "#dc2626")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.background = "#ef4444")
                        }
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
