import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";
import mongoose from "mongoose";
import { UserDocument, User } from "../src/models/User";

describe("Testes do usuário", () => {
  // Antes de cada teste limpa a coleção de usuários no banco de dados
  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Após todos os testes, desconecta do banco de dados
    await mongoose.disconnect();
  });

  it("deve criar um usuário", async () => {
    // Dados do usuário
    const userData: UserDocument = {
      email: "testesoftware@example.com",
      password: "password123",
      passwordResetToken: "",
      passwordResetExpires: new Date(),
      facebook: "",
      tokens: [],
      profile: {
        name: "Nome Usuário",
        gender: "Masculino",
        location: "Localização",
        website: "site.com",
        picture: "imagem.png",
      },
      comparePassword: jest.fn(),
      gravatar: jest.fn(),
    };

    // Crie um novo usuário
    const user = new User(userData);
    const savedUser = await user.save();

    // Verifique se o usuário foi salvo corretamente
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
  });

  it("deve comparar corretamente as senhas", async () => {
    const password = "password123";
    const user = new User({
      email: "test@example.com",
      password: bcrypt.hashSync(password),
      passwordResetToken: "",
      passwordResetExpires: new Date(),
      facebook: "",
      tokens: [],
      profile: {
        name: "Nome do Usuário",
        gender: "Masculino",
        location: "Localização",
        website: "website.com",
        picture: "imagem.png",
      },
      comparePassword: User.prototype.comparePassword,
      gravatar: jest.fn(),
    });

    // Verifica se a senha fornecida corresponde a senha do usuário
    user.comparePassword(password, (err: any, isMatch: any) => {
      expect(err).toBeNull();
      expect(isMatch).toBe(true);
    });
  });

  // Adicione mais testes conforme necessário
});
