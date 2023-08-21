import mongoose from "mongoose";
import supertest from "supertest";
import app from "../src/app"; 

describe("Autenticação de Usuário", () => {
  beforeAll(() => {
    // Suprimir saídas de log durante os testes
    console.log = jest.fn();
  });

  afterAll(() => {
    // Restaurar a saída de log
    console.log = console.log;
  });

  it("deve permitir que um usuário válido faça login", async () => {
    // Simular a autenticação com credenciais válidas
    const response = await request.post("/login").send({
      email: "usuario@example.com",
      password: "senha",
    });

    // Verificar o código de status e a mensagem flash
    expect(response.status).toBe(302); // Redirecionamento após o login
    expect(response.headers.location).toBe("/"); // Redirecionamento para a página inicial
    expect(response.headers["set-cookie"]).toBeDefined(); // Cookies definidos
  });

  it("não deve permitir o login com credenciais inválidas", async () => {
    // Simular a autenticação com credenciais inválidas
    const response = await request.post("/login").send({
      email: "usuario@example.com",
      password: "senha_incorreta",
    });

    // Verificar o código de status e a mensagem flash
    expect(response.status).toBe(302); // Redirecionamento após falha de login
    expect(response.headers.location).toBe("/login"); // Redirecionamento de volta para a página de login
    expect(response.headers["set-cookie"]).toBeUndefined(); // Cookies não definidos
  });
});

mongoose.connect = jest.fn();

// Configuração do Supertest
const request = supertest(app);

describe("Autenticação de Usuário", () => {
  beforeAll(() => {
    // Suprimir saídas de log durante os testes
    console.log = jest.fn();
  });

  afterAll(() => {
    // Restaurar a saída de log
    console.log = console.log;
  });

  it("deve permitir que um usuário válido faça login", async () => {
    // Simular a autenticação com credenciais válidas
    const response = await request.post("/login").send({
      email: "usuario@example.com",
      password: "senha",
    });

    // Verificar o código de status e a mensagem flash
    expect(response.status).toBe(302); // Redirecionamento após o login
    expect(response.headers.location).toBe("/"); // Redirecionamento para a página inicial
    expect(response.headers["set-cookie"]).toBeDefined(); // Cookies definidos
  });

  it("não deve permitir o login com credenciais inválidas", async () => {
    // Simular a autenticação com credenciais inválidas
    const response = await request.post("/login").send({
      email: "usuario@example.com",
      password: "senha_incorreta",
    });

    // Verificar o código de status e a mensagem flash
    expect(response.status).toBe(302); // Redirecionamento após falha de login
    expect(response.headers.location).toBe("/login"); // Redirecionamento de volta para a página de login
    expect(response.headers["set-cookie"]).toBeUndefined(); // Cookies não definidos
  });
});
