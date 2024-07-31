import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import App from "./App.vue";

describe("App", () => {
  const app = mount(App, {
    global: {
      stubs: ["RouterView"],
    },
  });

  it("should render correctly", () => {
    expect(app.exists()).toBe(true);
  });

  it("should render correctly", () => {
    expect(app.findComponent("router-view-stub").exists()).toBe(true);
  });
});
