import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  RouterLinkStub,
  VueWrapper,
  flushPromises,
  mount,
} from "@vue/test-utils";
import TheOTP from "../TheOTP.vue";
import { useRouter } from "vue-router";
import { createTestingPinia } from "@pinia/testing";
import TheTimer from "@/components/shared/forms/TheTimer.vue";
import BaseImage from "@/components/shared/customs/BaseImage.vue";
import OTPField from "@/components/shared/forms/OTPField.vue";
import AlertMessage from "@/components/shared/customs/AlertMessage.vue";
import { UserService } from "@/infra/api/services";
import { nextTick } from "vue";

describe("TheOTP", () => {
  const pinia = createTestingPinia({
    createSpy: vi.fn,
    stubActions: false,
  });

  let theOTP: VueWrapper;
  const push = vi.fn();

  beforeAll(() => {
    vi.mock("vue-i18n");
    vi.mock("vue-router");
  });

  Storage.prototype.getItem = vi.fn().mockReturnValue("wibrc@gg.fr");

  theOTP = mount(TheOTP, {
    global: {
      plugins: [pinia],
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
  });

  afterAll(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  it("should render correctly", () => {
    expect(theOTP.exists()).toBe(true);
  });

  it("should render the timer", () => {
    const timer = theOTP.findComponent(TheTimer);
    expect(timer.exists()).toBe(true);
    expect(timer.props().duration).toBe(600);
  });

  it("should get the email from the local storage or store", () => {
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem).toHaveBeenCalledWith("auth-user");
  });

  it("should render the awaited login button disabled by default", () => {
    const loginButton = theOTP.find<HTMLButtonElement>(
      "[data-test='send-otp-btn']"
    );
    expect(loginButton.exists()).toBe(true);
    expect(loginButton.element.disabled).toBe(true);
    expect(loginButton.text()).toBe("otp._btn");
  });

  it("should render the logo image", () => {
    const logo = theOTP.findComponent(BaseImage);
    expect(logo.exists()).toBe(true);
    expect(logo.props().name).toBe("logo.svg");
  });

  it("should display the awaited title", () => {
    expect(theOTP.find("[data-test='title']").text()).toBe("otp._ttl");
  });

  it("should display the awaited description", () => {
    expect(theOTP.find("[data-test='description']").text()).toBe("otp._desc");
  });

  it("should display the resent otp", () => {
    const resentOtp = theOTP.find("[data-test='resend-code']");
    expect(resentOtp.exists()).toBe(true);
    expect(resentOtp.text()).toBe("otp.not_getotp.resend");
  });

  it("should render the field to fill the otp code", () => {
    const otpField = theOTP.findComponent(OTPField);
    expect(otpField.exists()).toBe(true);
    expect(otpField.props()).toEqual({
      label: "otp.fill_lbl",
      discount: 6,
      modelValue: "",
      hasError: false,
      disabled: false,
    });
  });

  it("should display the email", () => {
    expect(theOTP.find("[data-test='email']").text()).toBe("wibrc@gg.fr");
  });

  it("should have the button disabled when the code is not 6 digits", async () => {
    let loginButton = theOTP.find<HTMLButtonElement>(
      "[data-test='send-otp-btn']"
    );
    expect(loginButton.element.disabled).toBe(true);
    theOTP.findComponent(OTPField).vm.$emit("update:modelValue", "39904");

    loginButton = theOTP.find<HTMLButtonElement>("[data-test='send-otp-btn']");
    expect(loginButton.element.disabled).toBe(true);
  });

  it("should display an error message when the code is expired", async () => {
    theOTP = mount(TheOTP, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    let alertErrorMessage = theOTP.findComponent(AlertMessage);
    expect(alertErrorMessage.exists()).toBe(false);

    theOTP.findComponent(OTPField).vm.$emit("update:modelValue", "839478");
    await nextTick();
    UserService.enableUser = vi.fn().mockRejectedValue({
      body: {
        message: "Code has expired",
      },
    });

    const loginButton = theOTP.find<HTMLButtonElement>(
      "[data-test='send-otp-btn']"
    );
    expect(loginButton.element.disabled).toBe(false);

    await theOTP.find("[data-test='send-otp-btn']").trigger("submit");
    await flushPromises();

    alertErrorMessage = theOTP.findComponent(AlertMessage);
    expect(alertErrorMessage.exists()).toBe(true);
    expect(alertErrorMessage.props().message).toBe("Code has expired");
  });

  it("should redirect to the success page when the otp is correct and not expired", async () => {
    useRouter.mockImplementationOnce(() => ({
      push,
    }));
    theOTP = mount(TheOTP, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    theOTP.findComponent(OTPField).vm.$emit("update:modelValue", "839489");
    await nextTick();

    UserService.enableUser = vi.fn();
    await theOTP.find("[data-test='send-otp-btn']").trigger("submit");
    await flushPromises();

    expect(theOTP.findComponent(AlertMessage).exists()).toBe(false);

    expect(UserService.enableUser).toHaveBeenCalledTimes(1);
    expect(UserService.enableUser).toHaveBeenCalledWith({
      requestBody: {
        code: "839489",
        email: "wibrc@gg.fr",
      },
    });

    expect(push).toHaveBeenCalledOnce();
    expect(push).toHaveBeenCalledWith("/login");
  });

  it("should get the new otp after clicking on `resend`", async () => {
    const resentOtp = theOTP.find("[data-test='resend-code']");
    expect(resentOtp.exists()).toBe(true);

    UserService.resendOtp = vi.fn().mockResolvedValueOnce({});
    vi.useFakeTimers();
    await resentOtp.find("[data-test='btn']").trigger("click");
    await flushPromises();

    expect(UserService.resendOtp).toHaveBeenCalledTimes(1);
    expect(UserService.resendOtp).toHaveBeenCalledWith({
      requestBody: {
        email: "wibrc@gg.fr",
      },
    });

    vi.advanceTimersByTime(1000);

    expect(theOTP.find("[data-test='resend-code']").text()).toBe(
      "otp.not_getotp.resend ✅"
    );

    vi.useRealTimers();
  });

  it("should display and error icon the new otp has failed to be resent after clicking on `resend`", async () => {
    vi.useFakeTimers();

    theOTP = mount(TheOTP, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    const resentOtp = theOTP.find("[data-test='resend-code']");
    expect(resentOtp.exists()).toBe(true);

    UserService.resendOtp = vi.fn().mockRejectedValueOnce({
      body: { message: "Server error" },
    });

    await resentOtp.find("[data-test='btn']").trigger("click");
    await flushPromises();

    expect(UserService.resendOtp).toHaveBeenCalledTimes(1);
    expect(UserService.resendOtp).toHaveBeenCalledWith({
      requestBody: {
        email: "wibrc@gg.fr",
      },
    });

    vi.advanceTimersByTime(120_000);
    await nextTick();

    expect(theOTP.findComponent(TheTimer).props().duration).toBe(480);
    expect(theOTP.find("[data-test='resend-code']").text()).toBe(
      "otp.not_getotp.resend ❌"
    );
    vi.advanceTimersByTime(60_000);
    await nextTick();

    UserService.resendOtp = vi.fn().mockResolvedValueOnce({});
    await theOTP
      .find("[data-test='resend-code'] [data-test='btn']")
      .trigger("click");
    await flushPromises();
    expect(theOTP.findComponent(TheTimer).props().duration).toBe(600);
    vi.useRealTimers();
  });

  it("should disabled the otp fields an and button to send otp when the timer has reached 0", async () => {
    vi.useFakeTimers();
    theOTP = mount(TheOTP, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    let loginButton = theOTP.find<HTMLButtonElement>(
      "[data-test='send-otp-btn']"
    );
    expect(loginButton.element.disabled).toBe(true);

    let otpField = theOTP.findComponent(OTPField);
    expect(otpField.props().disabled).toBe(false);

    vi.advanceTimersByTime(600_000);
    await nextTick();

    loginButton = theOTP.find<HTMLButtonElement>("[data-test='send-otp-btn']");
    expect(loginButton.element.disabled).toBe(true);

    otpField = theOTP.findComponent(OTPField);
    expect(otpField.props().disabled).toBe(true);

    vi.useRealTimers();
  });
});
