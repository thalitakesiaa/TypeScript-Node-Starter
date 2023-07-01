import winston from "winston";
import { expect } from "chai";

describe("Logger", () => {
  it("deve criar um logger com as opções corretas", () => {
    const options: winston.LoggerOptions = {
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === "production" ? "error" : "debug",
        }),
        new winston.transports.File({ filename: "debug.log", level: "debug" }),
      ],
    };

    const logger = winston.createLogger(options);

    expect(logger.transports.length).to.equal(2);

    const consoleTransport = logger.transports[0];
    expect(consoleTransport).to.be.instanceOf(winston.transports.Console);
    expect(consoleTransport.level).to.equal(
      process.env.NODE_ENV === "production" ? "error" : "debug"
    );

    const fileTransport = logger.transports[1];
    expect(fileTransport).to.be.instanceOf(winston.transports.File);
    expect(fileTransport.level).to.equal("debug");
    expect((fileTransport as any).filename).to.equal("debug.log");
  });
});
