import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { getContact, postContact } from "../src/controllers/contact";

// Mock das funções necessárias
jest.mock("express-validator", () => ({
  check: jest.fn().mockReturnThis(),
  validationResult: jest.fn()
}));

jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn((options, callback) => {
      callback();
    })
  }))
}));

// Mock das variáveis de ambiente
process.env.SENDGRID_USER = "seu_usuario";
process.env.SENDGRID_PASSWORD = "sua_senha";

describe("Testes para o controlador de contato", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        name: "Nome",
        email: "email@example.com",
        message: "Mensagem"
      },
      flash: jest.fn(),
      redirect: jest.fn()
    };

    res = {
      render: jest.fn(),
      redirect: jest.fn()
    };

    jest.clearAllMocks();
  });

  describe("Teste para a função getContact", () => {
    it("Deve renderizar a página de contato", () => {
      getContact(req as Request, res as Response);
      expect(res.render).toHaveBeenCalledWith("contact", {
        title: "Contact"
      });
    });
  });

  describe("Teste para a função postContact", () => {
    it("Deve redirecionar para a página de contato se houver erros de validação", async () => {
      const errorsMock = {
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => ["Erro"])
      };

      validationResult.mockReturnValueOnce(errorsMock);

      await postContact(req as Request, res as Response);

      expect(req.flash).toHaveBeenCalledWith("errors", ["Erro"]);
      expect(res.redirect).toHaveBeenCalledWith("/contact");
    });

    it("Deve enviar o email e redirecionar para a página de contato se não houver erros de validação", async () => {
      const errorsMock = {
        isEmpty: jest.fn(() => true)
      };

      validationResult.mockReturnValueOnce(errorsMock);

      await postContact(req as Request, res as Response);

      expect(req.flash).toHaveBeenCalledWith("success", {
        msg: "Email has been sent successfully!"
      });
      expect(res.redirect).toHaveBeenCalledWith("/contact");
    });

    it("Deve redirecionar para a página de contato se houver um erro ao enviar o email", async () => {
      const errorsMock = {
        isEmpty: jest.fn(() => true)
      };

      const sendMailMock = jest.fn((options, callback) => {
        callback(new Error("Erro ao enviar email"));
      });

      validationResult.mockReturnValueOnce(errorsMock);
      require("nodemailer").createTransport.mockReturnValueOnce({
        sendMail: sendMailMock
      });

      await postContact(req as Request, res as Response);

      expect(req.flash).toHaveBeenCalledWith("errors", {
        msg: "Erro ao enviar email"
      });
      expect(res.redirect).toHaveBeenCalledWith("/contact");
    });
  });
});
