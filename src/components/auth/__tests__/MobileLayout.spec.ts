import { mount } from "@vue/test-utils";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import MobileLayout from "../MobileLayout.vue";
import BaseImage from "@/components/shared/customs/BaseImage.vue";

describe("MobileLayout", () => {
  beforeAll(() => {
    vi.mock("vue-i18n");
  });

  const mobileLayout = mount(MobileLayout);

  afterAll(() => {
    vi.clearAllMocks();
  });

  it("should render correctly", () => {
    expect(mobileLayout.exists()).toBe(true);
  });

  it("should render the image", () => {
    const heroImage = mobileLayout.findComponent(BaseImage);
    expect(heroImage.exists()).toBe(true);
    expect(heroImage.props()).toEqual({
      name: "saly.svg",
      fetchPriority: "auto",
    });
  });

  it("should display the titles", () => {
    expect(mobileLayout.find("[data-test='level3-title']").text()).toBe(
      "_ttl3"
    );

    expect(mobileLayout.find("[data-test='level1-title']").text()).toBe("_ttl");

    expect(mobileLayout.find("[data-test='level2-title']").text()).toBe(
      "_ttl2"
    );
  });

  it("should have the get started button", () => {
    const getStartedBtn = mobileLayout.find("[data-test='get-started-btn']");
    expect(getStartedBtn.exists()).toBe(true);
    expect(getStartedBtn.text()).toBe("get_started_btn");
  });

  it("should emit the `get started` event when we click on the get started button", async () => {
    await mobileLayout.find("[data-test='get-started-btn']").trigger("click");
    expect(mobileLayout.emitted()).toHaveProperty("getStarted");
  });
});
