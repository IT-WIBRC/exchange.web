/// <reference types="cypress" />

export default function useCypressHelpers() {
  const fillOtpCode = (): void => {
    cy.get("[data-test='otp-field'] input")
      .first()
      .type("3")
      .next()
      .type("4")
      .next()
      .type("5")
      .next()
      .type("9")
      .next()
      .type("0")
      .next()
      .type("1");
  };

  const fillRegistrationForm = (): void => {
    cy.get("[data-test='username-input'] input").type("Username");
    cy.get("[data-test='email-input'] input").type("email@gmail.com");
    cy.get("[data-test='password-input'] input").type("Pass@4930");
  };

  return {
    fillOtpCode,
    fillRegistrationForm,
  };
}
