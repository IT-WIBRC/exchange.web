import useCypressInterceptors from "../../../utils/interceptors";
import useCypressHelpers from "../../../utils/helper";

const { interceptRegistration, interceptSendOtp, interceptResendOtp } =
  useCypressInterceptors();
const { fillOtpCode, fillRegistrationForm } = useCypressHelpers();

describe("Create account", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.viewport("iphone-x");
    cy.get("[data-test='get-started-btn']").click();
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

  it("should display an error message when the email has already been used", () => {
    fillRegistrationForm();

    interceptRegistration({
      code: 409,
      message: "Email has already been used",
    });

    cy.get("[data-test='registration-btn']").click();

    cy.get("[data-test='alert-message']").should(
      "have.text",
      "Email has already been used"
    );
  });

  it("should resend otp successfully", () => {
    fillRegistrationForm();

    interceptRegistration();
    cy.get("[data-test='registration-btn']").click();

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

    cy.clock();
    interceptResendOtp();
    cy.get("[data-test='resend-code'] [data-test='btn']").click();
    cy.wait("@resendOtp").then(({ request }) => {
      expect(request.body.email).to.eq("email@gmail.com");
    });

    cy.get("[data-test='success']").should("have.text", "✅");

    cy.tick(180_000);

    cy.get("[data-test='success']").should("not.exist");

    cy.clock().invoke("restore");
  });
});
