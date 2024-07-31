import { mount } from "@vue/test-utils";
import AlertMessage from "../AlertMessage.vue";
import { describe, expect, it } from "vitest";

describe("AlertMessage", () => {
  const alertMessage = mount(AlertMessage, {
    props: {
      message: "Message",
    },
  });

  it("should render correctly", () => {
    expect(alertMessage.exists()).toBe(true);
  });

  it("should display the message", () => {
    expect(alertMessage.text()).toBe("Message");
  });
});
