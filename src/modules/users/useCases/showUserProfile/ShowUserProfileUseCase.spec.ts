import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let userRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Get User Profile", () => {
  const userTemplate: ICreateUserDTO = {
    name: "admin",
    password: "admin",
    email: "admin@gmail.com"
  }

  beforeAll(async () => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory);

    await createUserUseCase.execute(userTemplate);
  });

  it("Should be able to show user profile", async () => {
    const result = await authenticateUserUseCase.execute({
      email: userTemplate.email,
      password: userTemplate.password
    });

    const response = await showUserProfileUseCase.execute(result.user.id ?? "");

    expect(response).toHaveProperty("id");
  });

  it("Should not be able to show a nonexistent user profile", async () => {
    expect(async () => {
      const result = await authenticateUserUseCase.execute({
        email: userTemplate.email,
        password: userTemplate.password
      });

      await showUserProfileUseCase.execute("nao existe");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
