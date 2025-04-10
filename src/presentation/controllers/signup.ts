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
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
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
      const account = await this.addAccount.add({
        name,
        email,
        password,
      });
      return ok(account);
    } catch (error) {
      return serverError();
    }
  }
}
