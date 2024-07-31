import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import PasswordField from "../PasswordField.vue";
import { ErrorObject } from "@vuelidate/core";

describe("PasswordField", () => {
  const passwordField = mount(PasswordField, {
    props: {
      label: "Password",
      placeholder: "Enter your password",
      errors: [],
      isRequired: false,
      modelValue: "",
    },
  });

  it("should render correctly", () => {
    expect(passwordField.exists()).toBe(true);
  });

  it("should display the label", () => {
    expect(passwordField.find("[data-test='label']").text()).toBe("Password");
  });

  it("should display the placeholder", () => {
    expect(passwordField.find("input").element.placeholder).toBe(
      "Enter your password"
    );
  });

  it("should not be required when 'isRequired' is False", () => {
    expect(passwordField.find("input").element.required).toBe(false);
  });

  it("should show/hide the text when we click on the show/hide button", async () => {
    let showPassword = passwordField.find("[data-test='show']");
    let hidePassword = passwordField.find("[data-test='hide']");

    expect(showPassword.exists()).toBe(true);
    expect(hidePassword.exists()).toBe(false);

    expect(showPassword.text()).toBe("visibility_off");
    await showPassword.trigger("click");

    hidePassword = passwordField.find("[data-test='hide']");
    showPassword = passwordField.find("[data-test='show']");

    expect(showPassword.exists()).toBe(false);
    expect(hidePassword.exists()).toBe(true);

    expect(hidePassword.text()).toBe("visibility");

    await hidePassword.trigger("click");

    hidePassword = passwordField.find("[data-test='hide']");
    showPassword = passwordField.find("[data-test='show']");

    expect(showPassword.exists()).toBe(true);
    expect(hidePassword.exists()).toBe(false);
  });

  it("should display the error when present", async () => {
    let emailError = passwordField.find("[data-test='error']");
    expect(emailError.exists()).toBe(false);
    await passwordField.setProps({
      errors: [
        {
          $message: "Must be an email",
          $property: "email",
        } as ErrorObject,
      ],
    });
    emailError = passwordField.find("[data-test='error']");
    expect(emailError.exists()).toBe(true);
    expect(emailError.text()).toBe("Must be an email");
  });

  it("should display one error at time when there are many", async () => {
    const customPasswordField = mount(PasswordField, {
      props: {
        label: "Email",
        placeholder: "Enter your email",
        errors: [],
        isRequired: false,
        modelValue: "",
      },
    });
    let emailError = customPasswordField.find("[data-test='error']");
    expect(emailError.exists()).toBe(false);
    await customPasswordField.setProps({
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
    emailError = customPasswordField.find("[data-test='error']");
    expect(emailError.exists()).toBe(true);
    expect(emailError.text()).toBe("Must be an email");
  });

  it("should have the awaited style when it has an error", async () => {
    const passwordField = mount(PasswordField, {
      props: {
        label: "Password",
        placeholder: "Enter your password",
        errors: [],
        isRequired: false,
        modelValue: "",
      },
    });
    expect(passwordField.find("input").attributes().class).toContain(
      "bg-[#F7F8F9] text-[#1C1C1E]"
    );
    await passwordField.setProps({
      hasError: true,
    });
    expect(passwordField.find("input").attributes().class).toContain(
      "bg-[#FCDEE4]"
    );
  });

  it("should emit the value typed", async () => {
    await passwordField.find("input").setValue("wibrC@123");
    expect(passwordField.emitted()).toHaveProperty("update:modelValue", [
      ["wibrC@123"],
    ]);
  });

  it("should display the `*` when the field is required", async () => {
    let wildcards = passwordField.find("[data-test='wildcard']");
    expect(wildcards.exists()).toBe(false);
    await passwordField.setProps({
      isRequired: true,
    });
    wildcards = passwordField.find("[data-test='wildcard']");
    expect(wildcards.exists()).toBe(true);
    expect(wildcards.text()).toBe("*");
  });
});
