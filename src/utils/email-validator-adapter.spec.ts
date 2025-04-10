import validator from "validator";
import { EmailValidatorAdapter } from "./email-validator-adapter";

jest.mock("validator", () => ({
  isEmail: () => true,
}));

function makeSut() {
  const sut = new EmailValidatorAdapter();
  return { sut };
}

describe("Signup Controller", () => {
  test("returns true if validator returns true", async () => {
    const { sut } = makeSut();
    const isValid = sut.isValid("valid_email@gmail.com");
    expect(isValid).toBe(true);
  });
});

describe("Signup Controller", () => {
  test("returns false if validator returns false", async () => {
    const { sut } = makeSut();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.isValid("invalid_email@gmail.com");
    expect(isValid).toBe(false);
  });
});
