import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  listAuthorizations,
  createAuthorization,
  refundAuthorization,
  retryCharge,
  listClients,
  deleteAuthorization,
} from "../api.js";

function formatDateBR(dateStr) {
  // Se já for uma data válida ISO (ex: 2025-10-16T20:30:00Z)
  const isoTest = new Date(dateStr);
  if (!isNaN(isoTest)) {
    return isoTest.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  }

  // Caso venha no formato brasileiro (ex: 16/10/2025 21:34:00)
  const parts = dateStr.split(/[\s/,:]+/); // divide por / ou espaço ou :
  if (parts.length >= 5) {
    const [dia, mes, ano, hora, min, seg] = parts;
    const date = new Date(`${ano}-${mes}-${dia}T${hora}:${min}:${seg || "00"}`);
    if (!isNaN(date)) {
      return date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
    }
  }

  // fallback se tudo falhar
  return dateStr;
}

function formatDateTime(isoString) {
  if (!isoString) return "—";
  let date;
  if (!isNaN(Date.parse(isoString))) {
    date = new Date(isoString);
  } else {
    const clean = String(isoString).replace(",", "");
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

export default function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  const [authorizations, setAuthorizations] = useState([]);
  const [clientName, setClientName] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [interval, setInterval] = useState("mensal");

  useEffect(() => {
    async function load() {
      const all = await listClients();
      const found = all.find((c) => c.id === id);
      if (found) setClientName(found.name);
      refresh();
    }
    load();
  }, [id]);

  async function refresh() {
    const data = await listAuthorizations(id);
    setAuthorizations(data);
  }

  async function addAuthorization() {
    if (!value) return alert("Informe um valor!");
    await createAuthorization(id, value, description, interval);
    setValue("");
    setDescription("");
    refresh();
  }

  async function triggerRefund(authId) {
    await refundAuthorization(authId);
    refresh();
  }

  async function triggerRetry(authId) {
  try {
    const res = await retryCharge(authId); // aguarda a resposta do backend
    console.log("Retry result:", res);
    await refresh(); // força recarregar a lista logo após
  } catch (err) {
    console.error("Erro ao tentar novamente:", err);
  }
}

  async function triggerCharge(authId) {
    try {
      await fetch(
        `${
          import.meta.env.VITE_API_BASE || "http://localhost:4000"
        }/api/trigger-charge`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ authorizationId: authId }),
        }
      );
      refresh();
    } catch (err) {
      console.error("Erro ao cobrar:", err);
    }
  }

  function getNextChargeDate(interval, createdAt) {
  if (!createdAt) return "—";

  // 🧩 Tenta converter datas no formato brasileiro (16/10/2025 21:43:00)
  let start;
  if (createdAt.includes("/")) {
    const parts = createdAt.split(/[\s/,:]+/);
    const [dia, mes, ano, hora = "00", min = "00", seg = "00"] = parts;
    start = new Date(`${ano}-${mes}-${dia}T${hora}:${min}:${seg}`);
  } else {
    start = new Date(createdAt);
  }

  if (isNaN(start)) return "—";

  const next = new Date(start);
  switch (interval) {
    case "semanal":
      next.setDate(start.getDate() + 7);
      break;
    case "mensal":
      next.setMonth(start.getMonth() + 1);
      break;
    case "semestral":
      next.setMonth(start.getMonth() + 6);
      break;
    case "anual":
      next.setFullYear(start.getFullYear() + 1);
      break;
    default:
      return "—";
  }

  // 🔧 Usa o mesmo formatador que você já tem (pt-BR)
  return formatDateTime(next.toISOString());
}

  const totalAuths = authorizations.length;
  const totalValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(
    authorizations
      .filter((a) => a.status === "paid")
      .reduce((acc, a) => {
        const numericValue =
          typeof a.value === "string"
            ? parseFloat(a.value.replace(/\./g, "").replace(",", "."))
            : Number(a.value || 0);
        return acc + numericValue;
      }, 0)
  );
  const lastCharge =
    authorizations
      .filter((a) => a.status === "paid")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      ?.createdAt || null;

  return (
    <div className="spacer-top">
      <div
        className="card container-narrow"
        style={{ width: "900px", maxWidth: "95%", padding: "40px 50px" }}
      >
        <button
          onClick={goBack}
          className="btn"
          style={{ marginBottom: 15 }}
        >
          ← Voltar
        </button>

        <h2 style={{ textAlign: "left", marginBottom: 25 }}>
          Cliente: {clientName || "Carregando..."}
        </h2>

        <div
          className="grid-cards"
          style={{
            marginBottom: 25,
            paddingBottom: 15,
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <div
            style={{
              background: "#f2f4ff",
              padding: "10px 15px",
              borderRadius: 8,
              flex: 1,
              textAlign: "center",
            }}
          >
            <strong>Autorizações:</strong>
            <div>{totalAuths}</div>
          </div>
          <div
            style={{
              background: "#f2f4ff",
              padding: "10px 15px",
              borderRadius: 8,
              flex: 1,
              textAlign: "center",
            }}
          >
            <strong>Total já cobrado:</strong>
            <div>{totalValue}</div>
          </div>
          <div
            style={{
              background: "#f2f4ff",
              padding: "10px 15px",
              borderRadius: 8,
              flex: 1,
              textAlign: "center",
            }}
          >
            <strong>Última cobrança:</strong>
            <div>{formatDateTime(lastCharge)}</div>
          </div>
        </div>

        <div
          className="form-row"
          style={{
            marginTop: 25,
            marginBottom: 10,
            justifyContent: "flex-start",
          }}
        >
          <input
            className="input"
            placeholder="Valor (R$)"
            value={value}
            onChange={(e) => {
              let raw = e.target.value.replace(/\D/g, "");
              if (!raw) return setValue("");
              let number = parseFloat(raw) / 100;
              const formatted = number.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
              setValue(formatted);
            }}
            onKeyDown={(e) => e.key === "Enter" && addAuthorization()}
            style={{ width: 120, textAlign: "right" }}
          />
          <select
            className="select"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            style={{ width: 120 }}
          >
            <option value="único">Único</option>
            <option value="semanal">Semanal</option>
            <option value="mensal">Mensal</option>
            <option value="semestral">Semestral</option>
            <option value="anual">Anual</option>
          </select>
          <input
            className="input"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addAuthorization()}
            style={{ width: 200 }}
          />
          <button
            className="btn"
            onClick={addAuthorization}
            style={{ minWidth: 150 }}
          >
            Nova autorização
          </button>
        </div>

        <div className="section-sep">
          {authorizations.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "#555",
                marginTop: 20,
              }}
            >
              Nenhuma autorização para este cliente. Comece criando uma Nova autorização acima.
            </p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Próxima cobrança</th>
                    <th>Status</th>
                    <th
                      colSpan="2"
                      style={{
                        textAlign: "center",
                        background: "#f9fafb",
                      }}
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
  {authorizations.map((a) => (
    <tr key={a.id}>
      <td>{a.description}</td>
      <td>R$ {a.value}</td>
      <td>{getNextChargeDate(a.interval, a.createdAt)}</td>
      <td>
        <span
          className="badge"
          style={{
            background:
              a.status === "paid"
                ? "#d1fae5"
                : a.status === "failed"
                ? "#fee2e2"
                : a.status === "refund_failed"
                ? "#fde68a"
                : a.status === "reembolsado"
                ? "#bfdbfe"
                : a.status === "pendente"
                ? "#fef9c3"
                : "#e5e7eb",
            color:
              a.status === "paid"
                ? "#065f46"
                : a.status === "failed"
                ? "#991b1b"
                : a.status === "refund_failed"
                ? "#92400e"
                : a.status === "reembolsado"
                ? "#1e40af"
                : a.status === "pendente"
                ? "#78350f"
                : "#374151",
          }}
        >
          {a.status === "paid"
            ? "Pago"
            : a.status === "failed"
            ? "Falhou"
            : a.status === "refund_failed"
            ? "Falha no reembolso"
            : a.status === "reembolsado"
            ? "Reembolsado"
            : a.status === "pendente"
            ? "Pendente"
            : a.status === "confirmada"
            ? "Confirmada"
            : a.status}
        </span>
        {a.reason_code && (
          <div style={{ color: "red", fontSize: 12, marginTop: 4 }}>
            {a.reason_code}: {a.reason_desc}
          </div>
        )}
      </td>

      {/* Coluna 1 — Ações principais */}
      <td
        style={{
          textAlign: "left",
          padding: "10px",
          borderBottom: "1px solid #e5e7eb",
          width: "260px",
        }}
      >
        {a.status === "failed" || a.status === "refund_failed" ? (
  <button
    className="btn"
    onClick={async () => {
      try {
        if (a.status === "failed") {
          // 🔁 Reprocessa cobrança normal
          await retryCharge(a.id);
        } else if (a.status === "refund_failed") {
          // 🔁 Reprocessa tentativa de reembolso
          await refundAuthorization(a.id);
        }
        await refresh(); // atualiza a lista de autorizações
      } catch (err) {
        console.error("Erro ao tentar novamente:", err);
      }
    }}
    style={{ minWidth: 160 }}
  >
    {a.status === "refund_failed"
      ? "Tentar reembolso novamente"
      : "Tentar novamente"}
  </button>
        ) : a.status === "paid" ? (
          <>
            <a
              className="btn-link"
              href={`${
                import.meta.env.VITE_API_BASE || "http://localhost:4000"
              }/invoice/${a.id}`}
              target="_blank"
              rel="noreferrer"
              style={{
                marginRight: 8,
                minWidth: 80,
                height: "22px",
                marginBottom: "5px",
              }}
            >
              Fatura
            </a>
            <button
              className="btn"
              onClick={() => triggerRefund(a.id)}
              style={{ minWidth: 110, marginTop: "5px" }}
            >
              Reembolsar
            </button>
          </>
        ) : a.status === "reembolsado" ? (
          <a
            className="btn-link"
            href={`${
              import.meta.env.VITE_API_BASE || "http://localhost:4000"
            }/credit-note/${a.id}`}
            target="_blank"
            rel="noreferrer"
            style={{ minWidth: 120, height: "22px" }}
          >
            Nota de crédito
          </a>
        ) : a.status === "pendente" ? (
          <button
            className="btn"
            onClick={() => triggerCharge(a.id)}
            style={{ minWidth: 110 }}
          >
            Cobrar
          </button>
        ) : (
          "-"
        )}
      </td>

      {/* Coluna 2 — Deletar */}
      <td
        style={{
          textAlign: "center",
          padding: "10px",
          borderBottom: "1px solid #e5e7eb",
          width: "100px",
        }}
      >
        <button
          onClick={async (e) => {
            e.stopPropagation();
            if (
              window.confirm("Tem certeza que deseja deletar esta autorização?")
            ) {
              await deleteAuthorization(a.id);
              setAuthorizations(authorizations.filter((x) => x.id !== a.id));
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
    </div>
  );
}
