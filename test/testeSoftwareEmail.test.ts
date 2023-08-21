import { createConnection, getConnection, getConnectionOptions } from 'typeorm';
import { ProfileRepository } from  '../entities/Profile';
import mongoose from "mongoose";
import "../config/passport";
import { User, UserDocument, AuthToken } from "../src/models/User";
import request from "supertest";
import app from "../src/app";
import { expect} from "chai";

describe('Teste de Encontrar Perfil pelo Email', () => {
  let profileRepository: ProfileRepository;

  beforeAll(async () => {
    const connectionOptions = await getConnectionOptions();
    await createConnection({ ...connectionOptions, name: 'testConnection' });
    profileRepository = getConnection('testConnection').getCustomRepository(ProfileRepository);
  });

  afterAll(async () => {
    const connection = getConnection('testConnection');
    await connection.close();
  });

  it('deve encontrar um perfil pelo email', async () => {
    // Crie um usuário no banco de dados usando a classe User
    const newUser = new User({
      email: 'alice@example.com',
      password: 'senha', // Lembre-se de ajustar isso
      profile: {
        name: 'Alice',
        gender: 'Feminino',
        location: 'Localização',
        website: 'https://example.com',
        picture: 'URL_da_foto'
      }
    });
    await newUser.save();

    // Encontre o perfil pelo email do usuário
    const perfilEncontrado = await profileRepository.findOne({ email: 'alice@example.com' });

    expect(perfilEncontrado).toBeDefined();
    expect(perfilEncontrado?.name).toBe('Alice');
  });

  it('deve retornar "undefined" se o email não existir', async () => {
    const perfilNaoEncontrado = await profileRepository.findOne({ email: 'email_que_nao_existe@example.com' });

    expect(perfilNaoEncontrado).toBeUndefined();
  });
});
