import { SignUpController } from "./signup";

describe("SignUp Controller", () => {
  test("Should return 400 if no name is provider", () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: "vittor",
        email: "email@email.com",
        password: "passwordd",
        password_confirmation: "passwordd",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });
});
