import { Request, Response, NextFunction } from "express";
import graph from "fbgraph";
import { getFacebook } from "../src/controllers/api";

jest.mock("fbgraph", () => ({
  setAccessToken: jest.fn(),
  get: jest.fn((url: string, callback: (error: null, result: { id: number, name: string }) => void) => {
    callback(null, { id: 1, name: "John Doe" });
  }),  
}));

describe("getFacebook", () => {
  it("deve chamar res.render com os parâmetros corretos quando a requisição é bem-sucedida", () => {
    const req = { user: { tokens: [{ kind: "facebook", accessToken: "token" }], facebook: "https://www.facebook.com/example" } } as unknown as Request;
    const res = { render: jest.fn() } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;

    getFacebook(req, res, next);

    expect(graph.setAccessToken).toHaveBeenCalledWith("token");
    expect(graph.get).toHaveBeenCalledWith(
      "https://www.facebook.com/example?fields=id,name,email,first_name,last_name,gender,link,locale,timezone",
      expect.any(Function)
    );
    expect(res.render).toHaveBeenCalledWith("api/facebook", {
      title: "Facebook API",
      profile: { id: 1, name: "John Doe" },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve chamar next com o erro quando a requisição falhar", () => {
    const req = { user: { tokens: [{ kind: "facebook", accessToken: "token" }], facebook: "https://www.facebook.com/example" } } as unknown as Request;
    const res = { render: jest.fn() } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;
    const error = new Error("Request failed");

    (graph.get as jest.Mock).mockImplementationOnce((url: string, callback: (error: Error) => void) => {
      callback(error);
    });
    getFacebook(req, res, next);

    expect(graph.setAccessToken).toHaveBeenCalledWith("token");
    expect(graph.get).toHaveBeenCalledWith(
      "https://www.facebook.com/example?fields=id,name,email,first_name,last_name,gender,link,locale,timezone",
      expect.any(Function)
    );
    expect(res.render).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
