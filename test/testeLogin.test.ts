import request from "supertest";
import { User, UserDocument } from "../src/models/User";
import app from "../src/app";

describe("Testes de Login", () => {
    let user: UserDocument;

    beforeAll(async () => {
        // Cria um usuário de teste no banco de dados
        user = await User.create({
            email: "teste@example.com",
            password: "testepassword",
        });
    });

    afterAll(async () => {
        // Limpa os dados de teste após os testes
        await User.deleteMany({});
    });

    it("Deve fazer login com sucesso", async () => {
        const response = await request(app)
            .post("/login")
            .send({
                email: user.email,
                password: "testepassword",
            });

        expect(response.status).toBe(302); // Verifica se o redirecionamento ocorreu
        expect(response.header.location).toBe("/"); // Verifica se o usuário foi redirecionado para a página inicial
    });

    it("Deve tratar login com informações inválidas", async () => {
        const response = await request(app)
            .post("/login")
            .send({
                email: user.email,
                password: "errorpassword",
            });

        expect(response.status).toBe(302); // Verifica se o redirecionamento ocorreu
        expect(response.header.location).toBe("/login"); // Verifique se o usuário foi redirecionado de volta para a página de login
    });

    it(" Trata login com email inválido", async () => {
        const response = await request(app)
            .post("/login")
            .send({
                email: "invalid@example.com",
                password: "testepassword",
            });

        expect(response.status).toBe(302); // Verifica se o redirecionamento ocorreu
        expect(response.header.location).toBe("/login"); // Verifica se o usuário foi redirecionado de volta para a página de login
    });
});
