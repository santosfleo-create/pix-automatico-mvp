const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

// -------------------- CONFIGURAÇÃO DE CORS --------------------
app.use(
  cors({
    origin: [
      "https://pix-automatico-mvp.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type"],
  })
);

// -------------------- MEMÓRIA SIMULADA --------------------
const clients = [];
const authorizations = [];

// Função auxiliar — traduz status
function traduzStatus(status) {
  const mapa = {
    pending: "Pendente",
    pendente: "Pendente",
    paid: "Pago",
    failed: "Falhou",
    refund_failed: "Falha no reembolso",
    reembolsado: "Reembolsado",
    refunded: "Reembolsado",
    confirmada: "Confirmada",
  };
  return mapa[status] || status;
}

// -------------------- CLIENTES --------------------
app.get("/api/clients", (req, res) => res.json(clients));

app.post("/api/clients", (req, res) => {
  const now = new Date();
  const createdAt = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short",
  }).format(now);

  const c = { id: uuidv4(), name: req.body.name, createdAt };
  clients.push(c);
  res.json(c);
});

app.delete("/api/clients/:id", (req, res) => {
  const id = req.params.id;
  const idx = clients.findIndex((c) => c.id === id);
  if (idx === -1)
    return res.status(404).json({ error: "Cliente não encontrado" });

  for (let i = authorizations.length - 1; i >= 0; i--) {
    if (authorizations[i].clientId === id) authorizations.splice(i, 1);
  }

  clients.splice(idx, 1);
  res.json({ success: true });
});

// -------------------- AUTORIZAÇÕES --------------------
app.get("/api/authorizations", (req, res) => {
  const clientId = req.query.clientId;
  if (clientId) {
    const clientAuths = authorizations.filter((a) => a.clientId === clientId);
    return res.json(clientAuths);
  }
  res.json(authorizations);
});

app.post("/api/authorizations", (req, res) => {
  const { clientId, value, description, interval } = req.body;
  if (!clientId || !value)
    return res
      .status(400)
      .json({ error: "clientId e value são obrigatórios." });

  const createdAt = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  const a = {
    id: uuidv4(),
    clientId,
    value,
    description,
    interval,
    status: "pendente",
    createdAt,
  };

  authorizations.push(a);
  res.json(a);
});

app.delete("/api/authorizations/:id", (req, res) => {
  const id = req.params.id;
  const idx = authorizations.findIndex((a) => a.id === id);
  if (idx === -1)
    return res.status(404).json({ error: "Autorização não encontrada" });
  authorizations.splice(idx, 1);
  res.json({ success: true });
});

// -------------------- COBRAR --------------------
app.post("/api/trigger-charge", (req, res) => {
  const { authorizationId } = req.body;
  const auth = authorizations.find((a) => a.id === authorizationId);
  if (!auth)
    return res.status(404).json({ error: "Autorização não encontrada." });

  const success = Math.random() > 0.2;
  if (success) {
    auth.status = "paid";
    auth.paidAt = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
  } else {
    auth.status = "failed";
    auth.reason_code = "PIX_FAILURE";
    auth.reason_desc = "Falha ao processar cobrança Pix.";
  }

  res.json({ success, status: auth.status, authorization: auth });
});

// -------------------- TENTAR NOVAMENTE --------------------
app.post("/api/retry-charge", (req, res) => {
  const { authorizationId } = req.body;
  const auth = authorizations.find((a) => a.id === authorizationId);
  if (!auth)
    return res.status(404).json({ error: "Autorização não encontrada." });

  const success = Math.random() > 0.2;
  if (success) {
    auth.status = "paid";
    auth.paidAt = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
    // 🧹 limpa erros antigos
    delete auth.reason_code;
    delete auth.reason_desc;
  } else {
    auth.status = "failed";
    auth.reason_code = "PIX_FAILURE";
    auth.reason_desc = "Falha ao processar cobrança Pix.";
  }

  res.json({ success, authorization: auth });
});

// -------------------- REEMBOLSAR --------------------
app.post("/api/refund", (req, res) => {
  const { authorizationId } = req.body;
  const auth = authorizations.find((a) => a.id === authorizationId);
  if (!auth)
    return res.status(404).json({ error: "Autorização não encontrada." });

  if (auth.status !== "paid" && auth.status !== "refund_failed")
  return res.status(400).json({ error: "Somente cobranças pagas ou com falha de reembolso podem ser reprocessadas." });

  const success = Math.random() > 0.1;
  if (success) {
  auth.status = "reembolsado";
  auth.refundAt = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });
  delete auth.reason_code;
  delete auth.reason_desc;
} else {
  auth.status = "refund_failed";
  auth.reason_code = "REFUND_DENIED";
  auth.reason_desc = "Falha ao processar reembolso.";
}

  res.json({ success, status: auth.status, authorization: auth });
});

// -------------------- FATURA --------------------
app.get("/invoice/:id", (req, res) => {
  const auth = authorizations.find((a) => a.id === req.params.id);
  if (!auth) return res.status(404).send("<h2>Fatura não encontrada</h2>");
  const client = clients.find((c) => c.id === auth.clientId);
  const clientName = client ? client.name : "Cliente não encontrado";

  const html = `
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Fatura ${auth.id}</title>
    <style>
      body { font-family: Arial, sans-serif; background: #f9fafb; padding: 30px; }
      .card { background: white; border-radius: 10px; padding: 20px; max-width: 500px; margin: 40px auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
      h2 { text-align: center; color: #111827; }
      p { font-size: 16px; margin-bottom: 8px; }
      .footer { text-align: center; color: #6b7280; font-size: 13px; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>💰 Fatura Pix Automático</h2>
      <p><strong>ID da autorização:</strong> ${auth.id}</p>
      <p><strong>Cliente:</strong> ${clientName}</p>
      <p><strong>Valor:</strong> R$ ${auth.value}</p>
      <p><strong>Descrição:</strong> ${auth.description || "-"}</p>
      <p><strong>Status:</strong> ${traduzStatus(auth.status)}</p>
      <p><strong>Data da criação:</strong> ${auth.createdAt}</p>
      <div class="footer">Pix Automático – MVP</div>
    </div>
  </body>
  </html>`;
  res.send(html);
});

// -------------------- NOTA DE CRÉDITO --------------------
app.get("/credit-note/:id", (req, res) => {
  const auth = authorizations.find((a) => a.id === req.params.id);
  if (!auth)
    return res.status(404).send("<h2>Nota de crédito não encontrada</h2>");
  const client = clients.find((c) => c.id === auth.clientId);
  const clientName = client ? client.name : "Cliente não encontrado";

  const html = `
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Nota de crédito ${auth.id}</title>
    <style>
      body { font-family: Arial, sans-serif; background: #f9fafb; padding: 30px; }
      .card { background: white; border-radius: 10px; padding: 20px; max-width: 500px; margin: 40px auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
      h2 { text-align: center; color: #065f46; }
      p { font-size: 16px; margin-bottom: 8px; }
      .footer { text-align: center; color: #6b7280; font-size: 13px; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>💸 Nota de Crédito Pix Automático</h2>
      <p><strong>ID da autorização:</strong> ${auth.id}</p>
      <p><strong>Cliente:</strong> ${clientName}</p>
      <p><strong>Valor reembolsado:</strong> R$ ${auth.value}</p>
      <p><strong>Descrição:</strong> ${auth.description || "-"}</p>
      <p><strong>Status:</strong> ${traduzStatus(auth.status)}</p>
      <p><strong>Data do reembolso:</strong> ${auth.refundAt || "—"}</p>
      <div class="footer">Pix Automático – MVP</div>
    </div>
  </body>
  </html>`;
  res.send(html);
});

app.get("/debug-routes", (req, res) => {
  const routes = app._router.stack
    .filter((r) => r.route)
    .map((r) => r.route.path);
  res.json(routes);
});

// -------------------- SERVER --------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend rodando na porta ${PORT}`));
