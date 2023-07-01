import request from "supertest";
import app from "../src/app";
import { expect } from "chai";

describe("GET /contact", () => {
it("deve retornar 200 OK", (done) => {
request(app).get("/contact")
.expect(200, done);
});
});

describe("POST /contact", () => {
it("deve retornar falso no assert quando nenhuma mensagem for encontrada", (done) => {
request(app).post("/contact")
.field("name", "Desconhecido")
.field("email", "desconhecido@estou.com")
.expect(302)
.end(function(err, res) {
expect(res.error).to.be.false;
done();
});
});
});

