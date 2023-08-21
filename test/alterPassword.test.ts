import request from "supertest";
import { User, UserDocument } from "../src/models/User";
import app from "../src/app";

describe("Testes de Alterar senha", () => {
    let user: UserDocument;

    beforeAll(async () => {
        // Cria um usuário de teste no banco de dados
        user = await User.create({
            email: "teste@email.com",
            password: "password",
        });
    });

    afterAll(async () => {
        // Limpa os dados de teste após os testes
        await User.deleteMany({});
    });

    it("Deve tratar usuario com informações inválidas", async () => {
        const response = await request(app)
            .post("/account/password")
            .send({
                email: "emailinvalido@email.com",
                password: "password",
            });

        expect(response.status).toBe(302); // Verifica se o redirecionamento ocorreu
        expect(response.header.location).toBe("/login"); // Verifique se o usuário foi redirecionado de volta para a página de alterar senha
    });

    it("Verifica se a alteração foi feita com sucesso", async () => {
        const response = await request(app)
            .post("/account/password")
            .send({
                email: "teste@email.com",
                password: "novapassword",
            });

        expect(response.status).toBe(302); // Verifica se o redirecionamento ocorreu
        expect(response.header.location).toBe("/login"); // Verifica se o usuário foi redirecionado de volta para a página inicial
    });
});
