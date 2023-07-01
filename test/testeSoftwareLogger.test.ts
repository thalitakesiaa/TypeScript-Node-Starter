import logger from "../src/util/logger";

describe("Teste do logger", () => {
  it("deve criar uma instância do logger", () => {
    expect(logger).toBeDefined();
  });

  it("deve criar uma instância com as opções corretas", () => {
    const expectedOptions = {
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === "production" ? "error" : "debug",
        }),
        new winston.transports.File({ filename: "debug.log", level: "debug" }),
      ],
    };

    expect(logger.options).toEqual(expectedOptions);
  });

  it("deve chamar o método debug quando NODE_ENV não for 'production'", () => {
    process.env.NODE_ENV = "development";

    // Mock para verificar se o método debug foi chamado
    logger.debug = jest.fn();

    logger.initializeLogging();

    expect(logger.debug).toHaveBeenCalledWith("Logging initialized at debug level");
  });
});
