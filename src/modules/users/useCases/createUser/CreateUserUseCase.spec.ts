import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User Use Case", () => {

  beforeAll(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });

  it("Should be able to create a new user", async () => {
    const result = await createUserUseCase.execute({
      name: "test",
      password: "test",
      email: "test@gmail.com"
    });

    expect(result).toHaveProperty("id");
  });

  it("Should not be able to create duplicated user", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "test2",
        password: "test2",
        email: "test2@gmail.com"
      });

      await createUserUseCase.execute({
        name: "test2",
        password: "test2",
        email: "test2@gmail.com"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
