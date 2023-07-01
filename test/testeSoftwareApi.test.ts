import { Request, Response, NextFunction } from "express";
import { UserDocument } from "../src/models/User";
import * as graph from "fbgraph";
import { getApi, getFacebook } from "../src/controllers/api";

jest.mock("fbgraph");

describe("Testes para as funções da API", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {
      render: jest.fn(),
    } as unknown as Response;
    next = jest.fn() as NextFunction;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Teste para getApi", () => {
    it("deve chamar res.render com os parâmetros corretos", () => {
      getApi(req, res);
      expect(res.render).toHaveBeenCalledWith("api/index", {
        title: "Exemplos de API",
      });
    });
  });

  describe("Teste para getFacebook", () => {
    it("deve chamar res.render com os parâmetros corretos quando a requisição é bem-sucedida", () => {
      const usuario = {
        tokens: [
          {
            type: "facebook",
            accessToken: "token",
          },
        ],
        facebook: "user_facebook_id",
      } as unknown as UserDocument;

      const resultados = {
        id: "user_id",
        nome: "JDesconhecido",
        email: "desconhecido@example.com",
        // outros campos do perfil do Facebook
      };

      const callbackGraph = jest.fn((err, resultadosCallback) => {
        resultadosCallback(resultados);
      });

      (graph.get as jest.Mock).mockImplementationOnce((_, callback) => {
        callback(null, callbackGraph);
      });

      req.user = usuario;

      getFacebook(req, res, next);

      expect(graph.setAccessToken).toHaveBeenCalledWith(usuario.tokens[0].accessToken);
      expect(graph.get).toHaveBeenCalledWith(
        `${usuario.facebook}?fields=id,nome,email,first_name,last_name,gender,link,locale,timezone`,
        expect.any(Function)
      );
      expect(res.render).toHaveBeenCalledWith("api/facebook", {
        title: "API do Facebook",
        perfil: resultados,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("deve chamar next com o erro quando a requisição falhar", () => {
      const usuario = {
        tokens: [
          {
            type: "facebook",
            accessToken: "token",
          },
        ],
        facebook: "user_facebook_id",
      } as unknown as UserDocument;

      const erro = new Error("Erro na requisição");

      const callbackGraph = jest.fn((err, resultadosCallback) => {
        resultadosCallback(null);
      });

      (graph.get as jest.Mock).mockImplementationOnce((_, callback) => {
        callback(erro, callbackGraph);
      });

      req.user = usuario;

      getFacebook(req, res, next);

      expect(graph.setAccessToken).toHaveBeenCalledWith(usuario.tokens[0].accessToken);
      expect(graph.get).toHaveBeenCalledWith(
        `${usuario.facebook}?fields=id,nome,email,first_name,last_name,gender,link,locale,timezone`,
        expect.any(Function)
      );
      expect(res.render).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(erro);
    });
  });
});
