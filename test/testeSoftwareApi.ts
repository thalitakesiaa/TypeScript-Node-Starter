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
    } as Response;
    next = jest.fn() as NextFunction;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Teste para getApi", () => {
    it("deve chamar res.render com os parâmetros corretos", () => {
      getApi(req, res);
      expect(res.render).toHaveBeenCalledWith("api/index", {
        title: "API Examples",
      });
    });
  });

  describe("Teste para getFacebook", () => {
    it("deve chamar res.render com os parâmetros corretos quando a requisição é bem-sucedida", () => {
      const user = {
        tokens: [
          {
            kind: "facebook",
            accessToken: "token",
          },
        ],
        facebook: "user_facebook_id",
      } as UserDocument;

      const results = {
        id: "user_id",
        name: "John Doe",
        email: "john.doe@example.com",
        
      };

      const graphCallback = jest.fn((err, callbackResults) => {
        callbackResults(results);
      });

      (graph.get as jest.Mock).mockImplementationOnce((_, callback) => {
        callback(null, graphCallback);
      });

      req.user = user;

      getFacebook(req, res, next);

      expect(graph.setAccessToken).toHaveBeenCalledWith(user.tokens[0].accessToken);
      expect(graph.get).toHaveBeenCalledWith(
        `${user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`,
        expect.any(Function)
      );
      expect(res.render).toHaveBeenCalledWith("api/facebook", {
        title: "Facebook API",
        profile: results,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("deve chamar next com o erro quando a requisição falhar", () => {
      const user = {
        tokens: [
          {
            kind: "facebook",
            accessToken: "token",
          },
        ],
        facebook: "user_facebook_id",
      } as UserDocument;

      const error = new Error("Erro na requisição");

      const graphCallback = jest.fn((err, callbackResults) => {
        callbackResults(null);
      });

      (graph.get as jest.Mock).mockImplementationOnce((_, callback) => {
        callback(error, graphCallback);
      });

      req.user = user;

      getFacebook(req, res, next);

      expect(graph.setAccessToken).toHaveBeenCalledWith(user.tokens[0].accessToken);
      expect(graph.get).toHaveBeenCalledWith(
        `${user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`,
        expect.any(Function)
      );
      expect(res.render).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
