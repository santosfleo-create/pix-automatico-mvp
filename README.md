# Pix Automático – MVP (pt-BR)

Duas páginas: **Clientes** e **Detalhes do Cliente**. Frontend React (Vite) e backend Node/Express, com dados em memória.

## Como rodar

### Backend
```
cd backend
npm install
npm start
```
Servidor: **http://localhost:4000**

### Frontend
Em outro terminal:
```
cd frontend
npm install
npm run dev
```
Abra o endereço mostrado (geralmente **http://localhost:5173**).

## Funcionalidades
- Clientes: listar e adicionar
- Detalhes do cliente:
  - Cards de resumo (Total de autorizações, Valor total, Última cobrança)
  - Criar autorização (valor, intervalo, descrição, **próxima cobrança**)
  - Criar cobrança, Reembolsar, Tentar reembolso novamente
  - Enviar Fatura (abre HTML; use “Salvar como PDF”)
  
> Dados em memória — ao reiniciar o backend, zeram.
