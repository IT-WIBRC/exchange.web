import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import EmailField from "../EmailField.vue";
import { ErrorObject } from "@vuelidate/core";

describe("EmailField", () => {
  const emailField = mount(EmailField, {
    props: {
      label: "Email",
      placeholder: "Enter your email",
      errors: [],
      isRequired: false,
      modelValue: "",
      hasError: false,
    },
  });

  it("should render correctly", () => {
    expect(emailField.exists()).toBe(true);
  });

  it("should display the label", () => {
    expect(emailField.find("label").text()).toBe("Email");
  });

  it("should display the placeholder", () => {
    expect(emailField.find("input").element.placeholder).toBe(
      "Enter your email"
    );
  });

  it("should not be required when 'isRequired' is False", () => {
    expect(emailField.find("input").element.required).toBe(false);
  });

  it("should display the error when present", async () => {
    let emailError = emailField.find("[data-test='error']");
    expect(emailError.exists()).toBe(false);
    await emailField.setProps({
      errors: [
        {
          $message: "Must be an email",
          $property: "email",
        } as ErrorObject,
      ],
    });
    emailError = emailField.find("[data-test='error']");
    expect(emailError.exists()).toBe(true);
    expect(emailError.text()).toBe("Must be an email");
  });

  it("should display one error at time when there are many", async () => {
    const customEmailField = mount(EmailField, {
      props: {
        label: "Email",
        placeholder: "Enter your email",
        errors: [],
        isRequired: false,
        modelValue: "",
      },
    });
    let emailError = customEmailField.find("[data-test='error']");
    expect(emailError.exists()).toBe(false);
    await customEmailField.setProps({
      errors: [
        {
          $message: "Must be an email",
          $property: "email",
        },
        {
          $message: "Must be an provide",
          $property: "email",
        },
      ] as ErrorObject[],
    });
    emailError = customEmailField.find("[data-test='error']");
    expect(emailError.exists()).toBe(true);
    expect(emailError.text()).toBe("Must be an email");
  });

  it("should have the awaited style when it has an error", async () => {
    const emailField = mount(EmailField, {
      props: {
        label: "Email",
        placeholder: "Enter your email",
        errors: [],
        isRequired: false,
        modelValue: "",
        hasError: false,
      },
    });
    expect(emailField.find("input").attributes().class).toContain(
      "bg-[#F7F8F9] text-[#1C1C1E]"
    );
    await emailField.setProps({
      hasError: true,
    });
    expect(emailField.find("input").attributes().class).toContain(
      "bg-[#FCDEE4]"
    );
  });

  it("should emit the value typed", async () => {
    await emailField.find("input").setValue("wibrc@");
    expect(emailField.emitted()).toHaveProperty("update:modelValue", [
      ["wibrc@"],
    ]);
  });

  it("should display the `*` when the field is required", async () => {
    let wildcards = emailField.find("[data-test='wildcard']");
    expect(wildcards.exists()).toBe(false);
    await emailField.setProps({
      isRequired: true,
    });
    wildcards = emailField.find("[data-test='wildcard']");
    expect(wildcards.exists()).toBe(true);
    expect(wildcards.text()).toBe("*");
  });
});
