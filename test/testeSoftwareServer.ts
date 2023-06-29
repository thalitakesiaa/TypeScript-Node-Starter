import errorHandler from "errorhandler";
import app from "../src/app";

jest.mock("errorhandler"); // Mockando o módulo 'errorhandler'

describe("Teste do servidor Express", () => {
  let server;
  
  beforeAll(() => {
    // Mockando a função 'listen' do Express para retornar um objeto simulado
    app.listen = jest.fn().mockReturnValue({
      address: jest.fn().mockReturnValue({
        port: 3000
      }),
      on: jest.fn()
    });
    
    // Executa o código antes de cada teste
    server = require("./app").default;
  });

  it("deve chamar o errorHandler em ambiente de desenvolvimento", () => {
    process.env.NODE_ENV = "development";
    expect(errorHandler).toHaveBeenCalled();
  });

  it("deve iniciar o servidor Express corretamente", () => {
    const consoleSpy = jest.spyOn(console, "log");
    server;
    expect(app.listen).toHaveBeenCalledWith(app.get("port"), expect.any(Function));
    expect(consoleSpy).toHaveBeenCalledWith(
      "  App is running at http://localhost:%d in %s mode",
      app.get("port"),
      app.get("env")
    );
    expect(consoleSpy).toHaveBeenCalledWith("  Press CTRL-C to stop\n");
  });
});
