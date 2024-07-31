import { VueWrapper, flushPromises, mount } from "@vue/test-utils";
import TheRegistrationForm from "../TheRegistrationForm.vue";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import TextInput from "@/components/shared/forms/TextInput.vue";
import EmailField from "@/components/shared/forms/EmailField.vue";
import PasswordField from "@/components/shared/forms/PasswordField.vue";
import { createTestingPinia } from "@pinia/testing";
import AlertMessage from "@/components/shared/customs/AlertMessage.vue";
import { UserService } from "@/infra/api/services";
import { useRouter } from "vue-router";
import { StorageLocal } from "@/infra/utils/types";

describe("TheRegistrationForm", () => {
  beforeAll(() => {
    vi.mock("vue-i18n");
    vi.mock("vue-router");
  });

  const theRegistrationForm = mount(TheRegistrationForm, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it("should render correctly", () => {
    expect(theRegistrationForm.exists()).toBe(true);
  });

  it("should display the registration title", () => {
    const title = theRegistrationForm.find("[data-test='title']");
    expect(title.exists()).toBe(true);
  });

  it("should display the registration description", () => {
    expect(theRegistrationForm.find("[data-test='description']").text()).toBe(
      "registration._desc"
    );
  });

  it("should display the message to lead the user whe it has an account already", () => {
    expect(theRegistrationForm.find("[data-test='no-account']").text()).toBe(
      "registration.no_account"
    );
  });

  it("should display the button to go to the login button", () => {
    expect(theRegistrationForm.find("[data-test='go-to-login']").text()).toBe(
      "login._btn"
    );
  });

  it("should display the registration button", () => {
    expect(
      theRegistrationForm.find("[data-test='registration-btn']").text()
    ).toBe("registration._btn");
  });

  it("should render the field to fill the username", () => {
    const username = theRegistrationForm.findComponent(TextInput);
    expect(username.exists()).toBe(true);
    expect(username.props()).toEqual({
      placeholder: "fields.username._ph",
      label: "fields.username._lbl",
      errors: [],
      modelValue: "",
      hasError: false,
      isRequired: false,
    });
  });

  it("should render the field to fill the email", () => {
    const email = theRegistrationForm.findComponent(EmailField);
    expect(email.exists()).toBe(true);
    expect(email.props()).toEqual({
      placeholder: "fields.email._ph",
      label: "fields.email._lbl",
      errors: [],
      modelValue: "",
      hasError: false,
      isRequired: false,
    });
  });

  it("should render the field to fill the password", () => {
    const password = theRegistrationForm.findComponent(PasswordField);
    expect(password.exists()).toBe(true);
    expect(password.props()).toEqual({
      placeholder: "fields.password._ph",
      label: "fields.password._lbl",
      errors: [],
      modelValue: "",
      hasError: false,
      isRequired: false,
    });
  });

  describe("Validations errors", () => {
    let theRegistrationForm: VueWrapper;
    beforeEach(() => {
      theRegistrationForm = mount(TheRegistrationForm, {
        global: {
          plugins: [
            createTestingPinia({
              createSpy: vi.fn,
            }),
          ],
        },
      });
    });

    it("should display errors when all fields are empty", async () => {
      await theRegistrationForm
        .find("[data-test='registration-btn']")
        .trigger("submit");
      await flushPromises();

      expect(
        theRegistrationForm.findComponent(TextInput).props().errors[0].$message
      ).toBe("fields.username.errors.required");
      expect(
        theRegistrationForm.findComponent(EmailField).props().errors[0].$message
      ).toBe("fields.email.errors.required");
      expect(
        theRegistrationForm.findComponent(PasswordField).props().errors[0]
          .$message
      ).toBe("fields.password.errors.required");
    });

    it("should display en error message when the username is less than 6 characters", async () => {
      let username = theRegistrationForm.findComponent(TextInput);
      expect(username.props().errors.length).toBe(0);

      await username.setValue("usern");
      await theRegistrationForm
        .find("[data-test='registration-btn']")
        .trigger("submit");
      await flushPromises();

      username = theRegistrationForm.findComponent(TextInput);
      expect(username.props().errors.length).toBe(1);
      expect(username.props().errors[0].$message).toBe(
        "fields.username.errors.min_length"
      );
    });

    it("should display en error message when the username is more than 12 characters", async () => {
      let username = theRegistrationForm.findComponent(TextInput);
      expect(username.props().errors.length).toBe(0);

      await username.setValue("usernameTester");
      await theRegistrationForm
        .find("[data-test='registration-btn']")
        .trigger("submit");
      await flushPromises();

      username = theRegistrationForm.findComponent(TextInput);
      expect(username.props().errors.length).toBe(1);
      expect(username.props().errors[0].$message).toBe(
        "fields.username.errors.max_length"
      );
    });

    it("should display en error message when the username contain an unsupported special character", async () => {
      let username = theRegistrationForm.findComponent(TextInput);
      expect(username.props().errors.length).toBe(0);

      await username.setValue("username@Tes");
      await theRegistrationForm
        .find("[data-test='registration-btn']")
        .trigger("submit");
      await flushPromises();

      username = theRegistrationForm.findComponent(TextInput);
      expect(username.props().errors.length).toBe(1);
      expect(username.props().errors[0].$message).toBe(
        "fields.username.errors.format"
      );
    });

    it("should display en error message when the email is an invalid one", async () => {
      let email = theRegistrationForm.findComponent(EmailField);
      expect(email.props().errors.length).toBe(0);

      await email.setValue("usern@.fr");
      await theRegistrationForm
        .find("[data-test='registration-btn']")
        .trigger("submit");
      await flushPromises();

      email = theRegistrationForm.findComponent(EmailField);
      expect(email.props().errors.length).toBe(1);
      expect(email.props().errors[0].$message).toBe(
        "fields.email.errors.valid_pattern"
      );
    });

    it("should display en error message when the password is invalid", async () => {
      let password = theRegistrationForm.findComponent(PasswordField);
      expect(password.props().errors.length).toBe(0);

      await password.setValue("usern@.fr");
      await theRegistrationForm
        .find("[data-test='registration-btn']")
        .trigger("submit");
      await flushPromises();

      password = theRegistrationForm.findComponent(PasswordField);
      expect(password.props().errors.length).toBe(1);
      expect(password.props().errors[0].$message).toBe(
        "fields.password.errors.valid_pattern"
      );
    });
  });

  it("should display an error message when the email has already been used", async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    });
    UserService.registration = vi.fn().mockRejectedValueOnce({
      body: { message: "Email and/or password do not match" },
    });

    const theRegistrationForm = mount(TheRegistrationForm, {
      global: {
        plugins: [pinia],
      },
    });
    let alertMessage = theRegistrationForm.findComponent(AlertMessage);
    expect(alertMessage.exists()).toBe(false);

    await theRegistrationForm.findComponent(TextInput).setValue("Username_Tes");
    await theRegistrationForm
      .findComponent(EmailField)
      .setValue("email@gmail.fr");
    await theRegistrationForm
      .findComponent(PasswordField)
      .setValue("Wibrc@4593");

    await theRegistrationForm
      .find("[data-test='registration-btn']")
      .trigger("submit");
    await flushPromises();

    expect(UserService.registration).toHaveBeenCalledTimes(1);
    expect(UserService.registration).toHaveBeenCalledWith({
      requestBody: {
        email: "email@gmail.fr",
        password: "Wibrc@4593",
        username: "Username_Tes",
      },
    });

    alertMessage = theRegistrationForm.findComponent(AlertMessage);
    expect(alertMessage.exists()).toBe(true);
    expect(alertMessage.props().message).toBe(
      "Email and/or password do not match"
    );
  });

  it("should display redirect to the opt when the registration is successful", async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    });
    UserService.registration = vi.fn().mockResolvedValueOnce({});

    const push = vi.fn();
    useRouter.mockImplementation(() => ({
      push,
    }));

    const theRegistrationForm = mount(TheRegistrationForm, {
      global: {
        plugins: [pinia],
      },
    });
    let alertMessage = theRegistrationForm.findComponent(AlertMessage);
    expect(alertMessage.exists()).toBe(false);

    await theRegistrationForm.findComponent(TextInput).setValue("Username_Tes");
    await theRegistrationForm
      .findComponent(EmailField)
      .setValue("email@gmail.fr");
    await theRegistrationForm
      .findComponent(PasswordField)
      .setValue("Wibrc@4593");

    Storage.prototype.setItem = vi.fn();
    await theRegistrationForm
      .find("[data-test='registration-btn']")
      .trigger("submit");
    await flushPromises();

    expect(UserService.registration).toHaveBeenCalledTimes(1);
    expect(UserService.registration).toHaveBeenCalledWith({
      requestBody: {
        email: "email@gmail.fr",
        password: "Wibrc@4593",
        username: "Username_Tes",
      },
    });

    alertMessage = theRegistrationForm.findComponent(AlertMessage);
    expect(alertMessage.exists()).toBe(false);

    expect(Storage.prototype.setItem).toHaveBeenCalledOnce();
    expect(Storage.prototype.setItem).toHaveBeenCalledWith(
      StorageLocal.AUTH_USER,
      "email@gmail.fr"
    );

    expect(push).toHaveBeenCalledOnce();
    expect(push).toHaveBeenCalledWith("/otp");
  });
});
