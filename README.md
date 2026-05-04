# Mauriti3D

Sistema de gestão de pedidos para impressão 3D, com kanban, calendário de datas comemorativas e dashboard financeiro.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Angular 21 + SCSS |
| Backend | Spring Boot 3.4 + Java 21 |
| Banco | PostgreSQL 16 (Docker) |
| Build | Maven 3.8 |

## Funcionalidades

- **Kanban de pedidos** — colunas Fila, Iniciado e Finalizado com busca por cliente
- **Paginação** na coluna Finalizado (10 por página, backend)
- **Calendário anual** com datas comemorativas, stats de pedidos e valor arrecadado por data
- **Dashboard mensal** — despesas, valor arrecadado (pago) e saldo esperado
- **Gestão de despesas** — Filamento, Embalagem, Equipamentos e Outros
- **Vínculo de pedidos** a datas comemorativas
- **Link WhatsApp** direto no detalhe de cada pedido

## Pré-requisitos

- Java 21+
- Node.js 18+
- Docker

## Rodando o projeto

**1. Banco de dados (PostgreSQL via Docker):**
```bash
docker compose up -d
```

**2. Backend (Spring Boot):**
```bash
cd backend
./mvnw spring-boot:run
```

**3. Frontend (Angular):**
```bash
cd frontend
ng serve
```

Acesse em **http://localhost:4200**

## Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/pedidos` | Lista pedidos ativos (Fila + Iniciado) |
| GET | `/api/pedidos/finalizados` | Lista finalizados paginado |
| POST | `/api/pedidos` | Cria pedido |
| PUT | `/api/pedidos/{id}` | Atualiza pedido |
| DELETE | `/api/pedidos/{id}` | Remove pedido |
| GET | `/api/datas` | Lista datas comemorativas |
| GET | `/api/datas/{id}/stats` | Stats de uma data (dias restantes, pedidos, valor) |
| GET | `/api/dashboard/mensal` | Resumo financeiro mensal |
| POST | `/api/despesas` | Registra despesa |

## Configuração do banco

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mauriti3d
spring.datasource.username=mauriti3d
spring.datasource.password=mauriti3d123
```

## Estrutura do projeto

```
Mauriti3D/
├── backend/          # Spring Boot — API REST
│   └── src/main/java/com/mauriti3d/backend/
│       ├── pedido/   # Pedidos, Despesas, Dashboard, Datas Comemorativas
│       └── config/   # CORS
├── frontend/         # Angular — SPA
│   └── src/app/
│       ├── pedido/   # Kanban + formulário + dashboard panel
│       ├── data-comemorativa/  # Calendário
│       └── despesa/  # Model + service
└── docker-compose.yml
```
