import { InvalidParamError, MissingParamError } from "../errors/index";
import { badRequest, ok, serverError } from "../helpers/http-helper";
import {
  IHttpRequest,
  IHttpResponse,
  IController,
  IEmailValidator,
  IAddAccount,
} from "../controllers/signup-protocols";

export class SignUpController implements IController {
  constructor(
    private readonly emailValidator: IEmailValidator,
    private readonly addAccount: IAddAccount
  ) {}
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
      const { password, passwordConfirmation, email, name } = httpRequest.body;
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError("passwordConfirmation"));
      }
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError("email"));
      }
      const newUser = this.addAccount.add({
        name,
        email,
        password,
      });
      return ok(newUser);
    } catch (error) {
      return serverError();
    }
  }
}
