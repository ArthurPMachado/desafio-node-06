import jwt from "jsonwebtoken";
import { User } from "../../entities/User";

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let authenticateUserUseCase: AuthenticateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  interface ITokenUser {
    user: User,
    token: string,
  }

  const user: ICreateUserDTO = {
    name: "admin",
    password: "admin",
    email: "admin@gmail.com"
  }


  beforeAll(async () => {
    userRepositoryInMemory = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);

    await createUserUseCase.execute(user);
  });

  it("Should be able to authenticate an user", async () => {
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(result).toHaveProperty("token");
  });

  it("Should not be able to authenticate a nonexistent user with incorrect email", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "nonexistentemail@gmail.com",
        password: user.password
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able to authenticate a user with incorrect password", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "12345678945623"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
