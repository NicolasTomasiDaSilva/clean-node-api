import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "../errors/index";
import { serverError } from "../helpers/http-helper";
import {
  IEmailValidator,
  IHttpRequest,
  IHttpResponse,
} from "../protocols/index";

import { SignUpController } from "./signup";

class EmailValidatorStub implements IEmailValidator {
  isValid(value: string): boolean {
    return true;
  }
}
class EmailValidatorWithError implements IEmailValidator {
  isValid(value: string): boolean {
    throw Error();
  }
}

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidatorStub;
}

function makeEmailValidatorStub(): IEmailValidator {
  return new EmailValidatorStub();
}

function makeSut(): SutTypes {
  const emailValidatorStub = makeEmailValidatorStub();
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
        email: "invalid_email",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });
});

describe("Signup Controller", () => {
  test("should return 400 ", () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith("any_email");
  });
});

describe("Signup Controller", () => {
  test("should return 500 if EmailValidor throws", () => {
    const emailValidatorWithError = new EmailValidatorWithError();
    const sut = new SignUpController(emailValidatorWithError);

    const httpRequest = {
      body: {
        name: "any_name",
        email: "invalid_email",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
