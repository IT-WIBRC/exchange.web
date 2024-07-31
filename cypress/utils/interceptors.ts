/// <reference types="cypress" />
type ResponseError = {
  code: number;
  message: string;
};

export default function useCypressInterCeptors() {
  const interceptRegistration = (body?: ResponseError) => {
    cy.intercept(
      {
        method: "POST",
        url: "/user",
      },
      {
        statusCode: body ? body.code : 201,
        body: body ? { message: body.message } : undefined,
      }
    ).as("registration");
  };

  const interceptSendOtp = (body?: ResponseError) => {
    cy.intercept(
      {
        method: "POST",
        url: "/user/otp-confirmation",
      },
      {
        statusCode: body ? body.code : 200,
        body: body ? { message: body.message } : undefined,
      }
    ).as("sendOtp");
  };

  const interceptResendOtp = (body?: ResponseError) => {
    cy.intercept(
      {
        method: "POST",
        url: "/user/otp-resend",
      },
      {
        statusCode: body ? body.code : 200,
        body: body ? { message: body.message } : undefined,
      }
    ).as("resendOtp");
  };

  return {
    interceptRegistration,
    interceptSendOtp,
    interceptResendOtp,
  };
}
