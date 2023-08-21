import request from "supertest";
import { User, UserDocument } from "../src/models/User";
import app from "../src/app";

describe("Testes de Deletar conta", () => {
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

    it("Deve deletar o usuário", async () => {
        const response = await request(app)
            .post("/account/delete")
            .send({
                email: user.email,
                password: user.password,
            });

        //expect(response.status).toBe(302); // Verifica se o redirecionamento ocorreu
        expect(response.header.location).toBe("/login"); // Verifica se o usuário foi redirecionado para a página inicial
    });
});
