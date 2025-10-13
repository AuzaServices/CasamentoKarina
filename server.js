const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Conexão com o banco de dados
const db = mysql.createPool({
  host: "sql10.freesqldatabase.com",
  user: "sql10799187",
  password: "NZdlWeIzBf",
  database: "sql10799187",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Teste de conexão
db.query("SELECT 1", (err) => {
  if (err) {
    console.error("Erro ao conectar no banco:", err.message);
  } else {
    console.log("Conexão com o banco funcionando!");
  }
});

// Rota para salvar presente
app.post("/presentes", (req, res) => {
  const { nome, data_presente, presente_escolhido } = req.body;

  if (!nome || !data_presente || !presente_escolhido) {
    return res.status(400).send("Dados incompletos");
  }

  const sql = "INSERT INTO presentes (nome, data_presente, presente_escolhido) VALUES (?, ?, ?)";
  db.query(sql, [nome, data_presente, presente_escolhido], (err, result) => {
    if (err) {
      console.error("Erro ao inserir:", err);
      return res.status(500).send("Erro ao salvar no banco");
    }
    res.send("Presente registrado com sucesso!");
  });
});

// Rota para listar presentes escolhidos (com ID)
app.get("/presentes", (req, res) => {
  const sql = "SELECT id, nome, data_presente, presente_escolhido FROM presentes";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar presentes:", err.message);
      return res.status(500).json({ erro: "Erro ao consultar o banco", detalhes: err.message });
    }
    res.json(results);
  });
});

// Rota para deletar presente por ID
app.delete("/presentes/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM presentes WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erro ao apagar presente:", err);
      return res.status(500).send("Erro ao apagar do banco");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Presente não encontrado");
    }

    res.send("Presente apagado com sucesso!");
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});