import { InvalidParamError } from "../errors/invalid-param-error";
import { MissingParamError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/http-helper";
import { IController } from "../protocols/controller";
import { IEmailValidator } from "../protocols/email-validator";
import { IHttpRequest, IHttpResponse } from "../protocols/http";

export class SignUpController implements IController {
  constructor(private readonly emailValidator: IEmailValidator) {}
  handle(httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = [
      "email",
      "name",
      "password",
      "passwordConfirmation",
    ];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
    if (!this.emailValidator.isValid(httpRequest.body["email"])) {
      return badRequest(new InvalidParamError("email"));
    }
  }
}
