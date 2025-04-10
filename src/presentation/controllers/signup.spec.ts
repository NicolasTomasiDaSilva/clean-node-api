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
  IAddAccount,
  AddAccountModel,
  AccountModel,
} from "../controllers/signup-protocols";

import { SignUpController } from "./signup";

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: IEmailValidator;
  addAccountStub: IAddAccount;
}

function makeEmailValidatorStub(): IEmailValidator {
  class EmailValidatorStub implements IEmailValidator {
    isValid(value: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
}
function makeAddAccountStub(): IAddAccount {
  class AddAccountStub implements IAddAccount {
    add(account: AddAccountModel): AccountModel {
      return {
        id: "any_id",
        name: account.name,
        email: account.email,
        password: account.password,
      };
    }
  }
  return new AddAccountStub();
}

function makeSut(): SutTypes {
  const emailValidatorStub = makeEmailValidatorStub();
  const addAccountStub = makeAddAccountStub();
  const signUpController = new SignUpController(
    emailValidatorStub,
    addAccountStub
  );
  return {
    sut: signUpController,
    emailValidatorStub: emailValidatorStub,
    addAccountStub: addAccountStub,
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
  test("should return 400 if  provided password != passwordConfirmation", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        passwordConfirmation: "invalid_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError("passwordConfirmation")
    );
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
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });

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

describe("Signup Controller", () => {
  test("should return 500 if addAccount throws", () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(() => {
      throw new Error();
    });

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

describe("Signup Controller", () => {
  test("should call AddAccount with correct values ", () => {
    const { sut, emailValidatorStub, addAccountStub } = makeSut();
    const addAccountSpy = jest.spyOn(addAccountStub, "add");

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    sut.handle(httpRequest);
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email",
      password: "any_password",
    });
  });
});

describe("Signup Controller", () => {
  test("should return 200 if valid data is provide", () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: "any_name",
        email: "valid_email",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.body).toEqual({
      id: "any_id",
      name: "any_name",
      email: "valid_email",
      password: "any_password",
    });
  });
});
