const API_BASE = import.meta.env.VITE_API_BASE;

export async function listClients() {
  const res = await fetch(`${API_BASE}/api/clients`);
  return res.json();
}

export async function createClient(name) {
  const res = await fetch(`${API_BASE}/api/clients`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name })
  });
  return res.json();
}

export async function listAuthorizations(clientId) {
  const res = await fetch(`${API_BASE}/api/authorizations?clientId=${clientId}`);
  return res.json();
}

export async function createAuthorization(clientId, value, description, interval) {
  const res = await fetch(`${API_BASE}/api/authorizations`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ clientId, value, description, interval })
  });
  return res.json();
}

// ---------------- Deletar cliente ----------------
export async function deleteClient(id) {
  await fetch(`${API_BASE}/api/clients/${id}`, {
    method: "DELETE",
  });
}

// ---------------- Deletar autorização ----------------
export async function deleteAuthorization(id) {
  await fetch(`${API_BASE}/api/authorizations/${id}`, {
    method: "DELETE",
  });
}

export async function refundAuthorization(authorizationId) {
  const res = await fetch(`${API_BASE}/api/refund`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authorizationId })
  });
  return res.json();
}

export async function retryCharge(authorizationId) {
  const res = await fetch(`${API_BASE}/api/retry-charge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authorizationId })
  });
  return res.json();
}
