import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import TextInput from "../TextInput.vue";
import { ErrorObject } from "@vuelidate/core";

describe("TextInput", () => {
  const textField = mount(TextInput, {
    props: {
      label: "Username",
      placeholder: "Enter your username",
      errors: [],
      isRequired: false,
      modelValue: "",
      hasError: false,
    },
  });

  it("should render correctly", () => {
    expect(textField.exists()).toBe(true);
  });

  it("should display the label", () => {
    expect(textField.find("label").text()).toBe("Username");
  });

  it("should display the placeholder", () => {
    expect(textField.find("input").element.placeholder).toBe(
      "Enter your username"
    );
  });

  it("should not be required when 'isRequired' is False", () => {
    expect(textField.find("input").element.required).toBe(false);
  });

  it("should display the error when present", async () => {
    let textError = textField.find("[data-test='error']");
    expect(textError.exists()).toBe(false);
    await textField.setProps({
      errors: [
        {
          $message: "Must be have 4 character",
          $property: "password",
        } as ErrorObject,
      ],
    });
    textError = textField.find("[data-test='error']");
    expect(textError.exists()).toBe(true);
    expect(textError.text()).toBe("Must be have 4 character");
  });

  it("should display one error at time when there are many", async () => {
    const customTextInput = mount(TextInput, {
      props: {
        label: "Username",
        placeholder: "Enter your username",
        errors: [],
        isRequired: false,
        modelValue: "",
      },
    });
    let textError = customTextInput.find("[data-test='error']");
    expect(textError.exists()).toBe(false);
    await customTextInput.setProps({
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
    textError = customTextInput.find("[data-test='error']");
    expect(textError.exists()).toBe(true);
    expect(textError.text()).toBe("Must be an email");
  });

  it("should have the awaited style when it has an error", async () => {
    const textField = mount(TextInput, {
      props: {
        label: "Username",
        placeholder: "Enter your username",
        errors: [],
        isRequired: false,
        modelValue: "",
        hasError: false,
      },
    });
    expect(textField.find("input").attributes().class).toContain(
      "bg-[#F7F8F9] text-[#1C1C1E]"
    );
    await textField.setProps({
      hasError: true,
    });
    expect(textField.find("input").attributes().class).toContain(
      "bg-[#FCDEE4]"
    );
  });

  it("should emit the value typed", async () => {
    await textField.find("input").setValue("wibrc@");
    expect(textField.emitted()).toHaveProperty("update:modelValue", [
      ["wibrc@"],
    ]);
  });

  it("should display the `*` when the field is required", async () => {
    let wildcards = textField.find("[data-test='wildcard']");
    expect(wildcards.exists()).toBe(false);
    await textField.setProps({
      isRequired: true,
    });
    wildcards = textField.find("[data-test='wildcard']");
    expect(wildcards.exists()).toBe(true);
    expect(wildcards.text()).toBe("*");
  });
});
