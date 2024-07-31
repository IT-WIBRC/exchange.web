import useCypressInterceptors from "../../../utils/interceptors";
import useCypressHelpers from "../../../utils/helper";

const { interceptRegistration, interceptSendOtp } = useCypressInterceptors();
const { fillOtpCode, fillRegistrationForm } = useCypressHelpers();

describe("Create account", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.viewport("macbook-13");
  });

  it("should create account successfully", () => {
    fillRegistrationForm();

    interceptRegistration();

    cy.get("[data-test='registration-btn']").click();
    cy.wait("@registration").then(({ request }) => {
      expect(request.body.email).to.eq("email@gmail.com");
      expect(request.body.password).to.eq("Pass@4930");
      expect(request.body.username).to.eq("Username");
    });

    cy.get("[data-test='email']").should("have.text", "email@gmail.com");

    interceptSendOtp();

    fillOtpCode();
    cy.get("[data-test='send-otp-btn']").click();
    cy.wait("@sendOtp").then(({ request }) => {
      expect(request.body.email).to.eq("email@gmail.com");
      expect(request.body.code).to.eq("345901");
    });

    cy.contains("The login");
  });

  it("should display an error message when the otp has expired", () => {
    fillRegistrationForm();

    interceptRegistration();

    cy.get("[data-test='registration-btn']").click();
    cy.wait("@registration").then(({ request }) => {
      expect(request.body.email).to.eq("email@gmail.com");
      expect(request.body.password).to.eq("Pass@4930");
      expect(request.body.username).to.eq("Username");
    });

    cy.get("[data-test='email']").should("have.text", "email@gmail.com");

    interceptSendOtp({
      code: 409,
      message: "Otp has expired",
    });

    fillOtpCode();
    cy.get("[data-test='send-otp-btn']").click();

    cy.get("[data-test='alert-message']").should(
      "have.text",
      "Otp has expired"
    );
  });
});
