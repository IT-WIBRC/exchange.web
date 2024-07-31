import { describe, expect, it } from "vitest";
import { validators } from "../validators";

describe("validators", () => {
  describe("passwordValidator", () => {
    it("should return `false` if the password has less than 8 characters", () => {
      expect(validators.passwordValidator("abcde@3")).toBe(false);
    });

    it("should return `false` if the password has more than 10 characters", () => {
      expect(validators.passwordValidator("abcde@3902der")).toBe(false);
    });

    it("should return `false` if the password does not contain one of those special characters `@$!%*?&`", () => {
      expect(validators.passwordValidator("abcde3453")).toBe(false);
    });

    it("should return `false` if the password does not contain any number", () => {
      expect(validators.passwordValidator("abcde@abed")).toBe(false);
    });

    it("should return `false` if the password does not contain any letter", () => {
      expect(validators.passwordValidator("34958@123")).toBe(false);
    });

    it("should return `false` if the password does not contain uppercase", () => {
      expect(validators.passwordValidator("abse@123")).toBe(false);
    });

    it("should return `false` if the password does not contain lowercase", () => {
      expect(validators.passwordValidator("ABDE@123")).toBe(false);
    });

    it("should return `true` if the password contain at leas one uppercase, lowercase, letter, number and at least one of those specials characters '@$!%*?&'", () => {
      expect(validators.passwordValidator("ABdf&123")).toBe(true);
    });
  });

  describe("usernameValidator", () => {
    it("should return `false` if the username does not contain alphanumeric characters", () => {
      expect(validators.usernameValidator("@$!%@3")).toBe(false);
      expect(validators.usernameValidator("A$!%@3")).toBe(false);
      expect(validators.usernameValidator("3$!%@3")).toBe(false);
    });

    it("should return `false` if the username start with special character", () => {
      expect(validators.usernameValidator("@$!%@3")).toBe(false);
    });

    it("should return `false` if the username end with special character", () => {
      expect(validators.usernameValidator("Wibrc_ed#")).toBe(false);
    });

    it("should return `true` if the username contain one of those (_- ) special characters", () => {
      expect(validators.usernameValidator("Wibrc_ed")).toBe(true);
    });
  });
});
