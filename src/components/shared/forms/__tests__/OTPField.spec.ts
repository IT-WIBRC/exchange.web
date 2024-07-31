import { describe, expect, it } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";
import OTPField from "../OTPField.vue";

describe("OTPField", () => {
  const app = document.createElement("div");
  app.id = "app";
  document.body.appendChild(app);

  const getOtp = (): VueWrapper =>
    mount(OTPField, {
      props: {
        modelValue: "",
        label: "Otp",
      },
      attachTo: "#app",
    });

  let otpField = getOtp();

  it("should render correctly", () => {
    expect(otpField.exists()).toBe(true);
  });

  it("should contain 5 inputs by default with the first one autofocus", () => {
    const otpInputs = otpField.findAll("input");
    expect(otpInputs.length).toBe(5);
    expect(otpInputs.at(0)?.element.autofocus).toBe(true);
  });

  it("should display the inputs according to the discount", async () => {
    otpField = getOtp();
    await otpField.setProps({
      discount: 7,
    });
    const otpInputs = otpField.findAll("input");
    expect(otpInputs.length).toBe(7);
    expect(otpInputs.at(0)?.element.autofocus).toBe(true);
  });

  it("should display the awaited label", () => {
    expect(otpField.find("label").text()).toBe("Otp");
  });

  it("should move to the next input when filled", async () => {
    await fillInput(0, 2);
    expect(otpField.findAll("input")?.at(1)?.element).toStrictEqual(
      document.activeElement
    );

    await fillInput(1, 2);
    expect(otpField.findAll("input")?.at(2)?.element).toStrictEqual(
      document.activeElement
    );
  });

  it("should delete when we click on `Backspace`", async () => {
    otpField = getOtp();

    await fillInput(0, 2);
    await fillInput(1, 5);

    expect(otpField.findAll("input").at(1)?.element.value).toBe("5");
    await otpField
      .findAll("input")
      ?.at(1)
      ?.trigger("keydown", { key: "Backspace" });
    expect(otpField.findAll("input").at(1)?.element.value).toBe("");
  });

  it("should not do anything when we click on 'ArrowRight, ArrowLeft, Tab'", async () => {
    await otpField
      .findAll("input")
      ?.at(0)
      ?.trigger("keydown", { key: "ArrowRight" });
    expect(otpField.findAll("input")?.at(0)?.element).toStrictEqual(
      document.activeElement
    );

    await otpField
      .findAll("input")
      ?.at(0)
      ?.trigger("keydown", { key: "ArrowLeft" });
    expect(otpField.findAll("input")?.at(0)?.element).toStrictEqual(
      document.activeElement
    );

    await otpField.findAll("input")?.at(0)?.trigger("keydown", { key: "Tab" });
    expect(otpField.findAll("input")?.at(0)?.element).toStrictEqual(
      document.activeElement
    );
  });

  it("should emit the values when the reach the discount", async () => {
    otpField = getOtp();
    await fillInput(0, 7);
    await fillInput(1, 5);
    await fillInput(2, 8);
    await fillInput(3, 9);
    await fillInput(4, 9);

    expect(otpField.emitted()).toHaveProperty("update:modelValue");
    expect(otpField.emitted()["update:modelValue"][4]).toEqual(["75899"]);
  });

  it("should be disabled when the props `disabled` is set to True", async () => {
    otpField = getOtp();
    await otpField.setProps({
      disabled: true,
    });
    await fillInput(0, 7);

    expect(otpField.emitted()).not.toHaveProperty("update:modelValue");
  });

  it("should display the error when present", async () => {
    otpField = getOtp();
    await otpField.setProps({
      hasError: true,
    });
    otpField.findAll("input").forEach((input) => {
      expect(input.attributes().class).toContain("bg-[#FCDEE4]");
    });
  });

  const fillInput = async (
    index: 0 | 1 | 2 | 3 | 4,
    value: number
  ): Promise<void> => {
    await otpField.findAll("input").at(index)?.setValue(value);
    await otpField
      .findAll("input")
      .at(index)
      ?.trigger("keydown", { key: `${value}` });
  };
});
