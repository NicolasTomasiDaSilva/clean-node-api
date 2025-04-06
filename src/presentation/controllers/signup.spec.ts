import { MissingParamError } from "../errors/missing-param-error";
import { IHttpRequest, IHttpResponse } from "../protocols/http";
import { SignUpController } from "./signup";

describe("Signup Controller", () => {
  test("should return 400 if no name is provided", () => {
    const sut = new SignUpController();
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
    const sut = new SignUpController();
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
