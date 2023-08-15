import { SignUpController } from "./signup";
import { InvalidParamError, MissingParamError, ServerError } from "../errors";
import { EmailValidator } from "../protocols/email-validator";

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SignUpController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};

describe("SignUp Controller", () => {
  test("Should return 400 if no name is provider", () => {
    const { sut } = makeSut();

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
  const { sut } = makeSut();
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
  const { sut } = makeSut();
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
  const { sut } = makeSut();
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

test("Should return 400 if an invalid email is provider", () => {
  const { sut, emailValidatorStub } = makeSut();
  jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
  const httpRequest = {
    body: {
      name: "name",
      email: "invalid@email.com",
      password: "passwordd",
      password_confirmation: "passwordd",
    },
  };
  const httpResponse = sut.handle(httpRequest);
  expect(httpResponse.statusCode).toBe(400);
  expect(httpResponse.body).toEqual(new InvalidParamError("email"));
});

test("Should call EmailValidation with correct email", () => {
  const { sut, emailValidatorStub } = makeSut();
  const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
  const httpRequest = {
    body: {
      name: "name",
      email: "invalid@email.com",
      password: "passwordd",
      password_confirmation: "passwordd",
    },
  };
  sut.handle(httpRequest);
  expect(isValidSpy).toHaveBeenCalledWith("invalid@email.com");
});

test("Should return 500 if EmailValidator throws", () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      throw new Error();
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SignUpController(emailValidatorStub);
  const httpRequest = {
    body: {
      name: "name",
      email: "invalid@email.com",
      password: "passwordd",
      password_confirmation: "passwordd",
    },
  };
  const httpResponse = sut.handle(httpRequest);
  expect(httpResponse.statusCode).toBe(500);
  expect(httpResponse.body).toEqual(new ServerError());
});
