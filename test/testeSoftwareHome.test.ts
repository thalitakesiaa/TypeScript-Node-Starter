import { Request, Response } from "express";
import { index } from "../src/controllers/home"; 

describe("Testes para a página inicial", () => {
  test("Deve renderizar a página inicial corretamente", () => {
    const req = {} as Request;
    const res = {
      render: jest.fn(),
    } as unknown as Response;

    index(req, res);

    expect(res.render).toHaveBeenCalledWith("home", {
      title: "Home",
    });
  });
});
