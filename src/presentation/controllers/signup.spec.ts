import { SignUpController } from "./signup";
import { MissingParamError } from "../erros/missing-param-error";

const makeSut = (): SignUpController => {
  return new SignUpController();
};

describe("SignUp Controller", () => {
  test("Should return 400 if no name is provider", () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        email: "email@email.com",
        password: "passwordd",
        password_confirmation: "passwordd",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });
});

test("Should return 400 if no email is provider", () => {
  const sut = makeSut();
  const httpRequest = {
    body: {
      name: "name",
      password: "passwordd",
      password_confirmation: "passwordd",
    },
  };
  const httpResponse = sut.handle(httpRequest);
  expect(httpResponse.statusCode).toBe(400);
  expect(httpResponse.body).toEqual(new MissingParamError("email"));
});

test("Should return 400 if no password is provider", () => {
  const sut = makeSut();
  const httpRequest = {
    body: {
      email: "email@email.com",
      name: "name",
      password_confirmation: "passwordd",
    },
  };
  const httpResponse = sut.handle(httpRequest);
  expect(httpResponse.statusCode).toBe(400);
  expect(httpResponse.body).toEqual(new MissingParamError("password"));
});

test("Should return 400 if no password confirmation is provider", () => {
  const sut = makeSut();
  const httpRequest = {
    body: {
      email: "email@email.com",
      name: "name",
      password: "passwordd",
    },
  };
  const httpResponse = sut.handle(httpRequest);
  expect(httpResponse.statusCode).toBe(400);
  expect(httpResponse.body).toEqual(
    new MissingParamError("password_confirmation")
  );
});
