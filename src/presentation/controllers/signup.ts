import { InvalidParamError, MissingParamError } from "../errors/index";
import { badRequest, serverError } from "../helpers/http-helper";
import {
  IEmailValidator,
  IHttpRequest,
  IHttpResponse,
  IController,
} from "../protocols/index";

export class SignUpController implements IController {
  constructor(private readonly emailValidator: IEmailValidator) {}
  handle(httpRequest: IHttpRequest): IHttpResponse {
    try {
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
      if (
        httpRequest.body["password"] !==
        httpRequest.body["passwordConfirmation"]
      ) {
        return badRequest(new InvalidParamError("passwordConfirmation"));
      }
      if (!this.emailValidator.isValid(httpRequest.body["email"])) {
        return badRequest(new InvalidParamError("email"));
      }
    } catch (error) {
      return serverError();
    }
  }
}
