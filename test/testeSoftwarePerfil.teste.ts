
import { User, UserDocument, AuthToken } from "../src/models/User";
import mongoose from "mongoose";
import "../config/passport";


describe('Teste de Atualização de Perfil', () => {
  // Antes de cada teste, limpe o banco de dados ou configure uma estratégia de isolamento
  beforeEach(async () => {
    // Conecte ao banco de dados de teste (ou limpe o banco se necessário)
    await mongoose.connect('mongodb://localhost:3000, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await mongoose.connection.db.dropDatabase(); // Limpe o banco
  });

  // Depois de cada teste, desconecte do banco
  afterEach(async () => {
    await mongoose.disconnect();
  });

  it('deve atualizar o perfil com sucesso', async () => {
    const response = await request(app)
      .post('./account')
      .send({
        email: 'novo_email@example.com',
        name: 'Novo Nome',
        gender: 'Feminino',
        location: 'Nova Localização',
        website: 'https://novosite.com',
      });

    // Verifique se a resposta é 302 (redirecionamento após atualização bem-sucedida)
    expect(response.status).toBe(302);

    // Faça mais verificações no banco de dados para confirmar a atualização
    // Exemplo: consulte o usuário pelo email atualizado e verifique os dados
    const updatedUser = await User.findOne({ email: 'novo_email@example.com' });
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.profile.name).toBe('Novo Nome');
    expect(updatedUser?.profile.gender).toBe('Feminino');
    // ...
  });

  it('deve lidar com erros de validação', async () => {
    const response = await request(app)
      .post('/account')
      .send({
        email: 'email_invalido', // Isso vai falhar na validação
      });

    // Verifique se a resposta é 302 (redirecionamento devido a erros de validação)
    expect(response.status).toBe(302);

    // Faça mais verificações se necessário
    // ...
  });
});
