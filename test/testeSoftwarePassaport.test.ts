import passport from 'passport';
import { User, UserDocument } from '../src/models/User';
import { NativeError } from 'mongoose';

jest.mock('passport');
jest.mock('../models/User');

describe('Passport Test', () => {
  let FacebookStrategy;
  let passportUse;
  let UserFindOne;
  let UserFindById;
  let UserSave;

  beforeAll(() => {
    FacebookStrategy = passport.Strategy;
    passportUse = passport.use;
    UserFindOne = User.findOne;
    UserFindById = User.findById;
    UserSave = User.prototype.save;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('deve serializar o usuário corretamente', () => {
    const done = jest.fn();
    const req = {};
    const user = { id: '123' };

    passport.serializeUser.mockImplementationOnce((req, user, done) => {
      done(undefined, user);
    });

    passport.serializeUser(req, user, done);

    expect(done).toHaveBeenCalledWith(undefined, user);
  });

  it('deve desserializar o usuário corretamente', () => {
    const done = jest.fn();
    const id = '123';
    const user = { id: '123' };

    UserFindById.mockImplementationOnce((id, callback) => {
      callback(undefined, user);
    });

    passport.deserializeUser(id, done);

    expect(UserFindById).toHaveBeenCalledWith(id, expect.any(Function));
    expect(done).toHaveBeenCalledWith(undefined, user);
  });

  it('deve usar a estratégia do Facebook corretamente', () => {
    const FacebookStrategyMock = jest.fn();
    const done = jest.fn();
    const req = {};
    const accessToken = 'access_token';
    const refreshToken = 'refresh_token';
    const profile = { id: '123', name: { givenName: 'Joao', familyName: 'Alguem' }, _json: { email: 'joao@exemplo.com', gender: 'male' } };
    const existingUser = null;
    const existingEmailUser = null;
    const user = new User();

    UserFindOne.mockImplementationOnce((conditions, callback) => {
      callback(undefined, existingUser);
    });

    UserFindById.mockImplementationOnce((id, callback) => {
      callback(undefined, user);
    });

    UserSave.mockImplementationOnce(callback => {
      callback(undefined);
    });

    passport.use.mockImplementationOnce((strategy, callback) => {
      callback(req, accessToken, refreshToken, profile, done);
    });

    FacebookStrategy.mockImplementationOnce(FacebookStrategyMock);

    passport.use(new FacebookStrategy());

    expect(passport.use).toHaveBeenCalledWith(FacebookStrategyMock);

    expect(FacebookStrategyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: '/auth/facebook/callback',
        profileFields: ['name', 'email', 'link', 'locale', 'timezone'],
        passReqToCallback: true,
      }),
      expect.any(Function)
    );

    expect(UserFindOne).toHaveBeenCalledWith({ facebook: profile.id }, expect.any(Function));
    expect(UserFindById).toHaveBeenCalledWith(req.user.id, expect.any(Function));
    expect(UserSave).toHaveBeenCalledWith(expect.any(Function));
    expect(done).toHaveBeenCalledWith(undefined, user);
  });
});