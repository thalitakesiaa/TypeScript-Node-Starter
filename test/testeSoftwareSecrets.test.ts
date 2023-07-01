import logger from "../src/util/logger";
import dotenv from "dotenv";
import fs from "fs";

jest.mock("./logger"); // Mockando o módulo logger

describe("Testes para o arquivo de configuração", () => {
  beforeEach(() => {
    jest.resetModules(); // Reseta os módulos importados antes de cada teste
  });

  test("Deve usar .env se o arquivo existir", () => {
    fs.existsSync = jest.fn(() => true); // Mockando a existência do arquivo .env

    const dotenvConfigSpy = jest.spyOn(dotenv, "config");
    require("./config"); // Importa o arquivo para testá-lo

    expect(dotenvConfigSpy).toHaveBeenCalledWith({ path: ".env" });
    expect(logger.debug).toHaveBeenCalledWith(
      "Using .env file to supply config environment variables"
    );
  });

  test("Deve usar .env.example se o arquivo .env não existir", () => {
    fs.existsSync = jest.fn(() => false); // Mockando a ausência do arquivo .env

    const dotenvConfigSpy = jest.spyOn(dotenv, "config");
    require("./config"); // Importa o arquivo para testá-lo

    expect(dotenvConfigSpy).toHaveBeenCalledWith({ path: ".env.example" });
    expect(logger.debug).toHaveBeenCalledWith(
      "Using .env.example file to supply config environment variables"
    );
  });

  test("Deve verificar se SESSION_SECRET está definido", () => {
    process.env.SESSION_SECRET = undefined; // Mockando a ausência de SESSION_SECRET

    const loggerErrorSpy = jest.spyOn(logger, "error");
    const processExitSpy = jest.spyOn(process, "exit").mockImplementation();

    require("./config"); // Importa o arquivo para testá-lo

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      "No client secret. Set SESSION_SECRET environment variable."
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  test("Deve verificar se MONGODB_URI está definido", () => {
    process.env.NODE_ENV = "production";
    process.env.MONGODB_URI = undefined; // Mockando a ausência de MONGODB_URI

    const loggerErrorSpy = jest.spyOn(logger, "error");
    const processExitSpy = jest.spyOn(process, "exit").mockImplementation();

    require("./config"); // Importa o arquivo para testá-lo

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      "No mongo connection string. Set MONGODB_URI environment variable."
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  test("Deve verificar se MONGODB_URI_LOCAL está definido", () => {
    process.env.NODE_ENV = "development";
    process.env.MONGODB_URI_LOCAL = undefined; // Mockando a ausência de MONGODB_URI_LOCAL

    const loggerErrorSpy = jest.spyOn(logger, "error");
    const processExitSpy = jest.spyOn(process, "exit").mockImplementation();

    require("./config"); // Importa o arquivo para testá-lo

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      "No mongo connection string. Set MONGODB_URI_LOCAL environment variable."
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
