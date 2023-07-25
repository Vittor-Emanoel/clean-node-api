import { MissingParamError } from "../erros/missing-param-error";
import { badRequest } from "../helpers/http-helper";
import { HttpResponse, HttpRequest } from "../protocols/http";

export class SignUpController {
  handle(httpRequest: HttpRequest): any {
    const requiredFields = [
      "name",
      "email",
      "password",
      "password_confirmation",
    ];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
  }
}
