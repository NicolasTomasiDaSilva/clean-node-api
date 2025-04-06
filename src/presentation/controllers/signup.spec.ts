import { InvalidParamError } from "../errors/invalid-param-error";
import { MissingParamError } from "../errors/missing-param-error";
import { IEmailValidator } from "../protocols/email-validator";
import { IHttpRequest, IHttpResponse } from "../protocols/http";
import { SignUpController } from "./signup";

interface SutTypes {}

class EmailValidatorStub implements IEmailValidator {
  isValid(value: string): boolean {
    return true;
  }
}

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidatorStub;
}

function makeSut(): SutTypes {
  const emailValidatorStub = new EmailValidatorStub();
  const signUpController = new SignUpController(emailValidatorStub);
  return {
    sut: signUpController,
    emailValidatorStub: emailValidatorStub,
  };
}

describe("Signup Controller", () => {
  test("should return 400 if no name is provided", () => {
    const { sut } = makeSut();
    const httpRequest: IHttpRequest = {
      body: {
        // name: "any_name",
        email: "any_email",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse: IHttpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });
});

describe("Signup Controller", () => {
  test("should return 400 if no email is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        //email: "any_email",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });
});

describe("Signup Controller", () => {
  test("should return 400 if an invalid email is provided", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });
});
