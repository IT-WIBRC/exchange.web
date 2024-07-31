import { VueWrapper, mount } from "@vue/test-utils";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import TheAuthLayout from "../TheAuthLayout.vue";
import BaseImage from "@/components/shared/customs/BaseImage.vue";
import MobileLayout from "../MobileLayout.vue";
import { nextTick } from "vue";

describe("TheAuthLayout", () => {
  beforeAll(() => {
    vi.mock("vue-i18n");
  });

  let theAuthLayout: VueWrapper;
  theAuthLayout = mount(TheAuthLayout, {
    global: {
      stubs: ["RouterView"],
    },
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it("should render correctly", () => {
    expect(theAuthLayout.exists()).toBe(true);
  });

  describe("On Laptop", () => {
    theAuthLayout = mount(TheAuthLayout, {
      global: {
        stubs: ["RouterView"],
      },
    });

    it("should render the router-view component", () => {
      expect(theAuthLayout.findComponent("router-view-stub").exists()).toBe(
        true
      );
    });

    it("should render the image", () => {
      const heroImage = theAuthLayout.findComponent(BaseImage);
      expect(heroImage.exists()).toBe(true);
      expect(heroImage.props()).toEqual({
        name: "saly.svg",
        fetchPriority: "auto",
      });
    });

    it("should display the titles", () => {
      expect(theAuthLayout.find("[data-test='level3-title']").text()).toBe(
        "_ttl3"
      );

      expect(theAuthLayout.find("[data-test='level-title']").text()).toBe(
        "_ttl"
      );

      expect(theAuthLayout.find("[data-test='level2-title']").text()).toBe(
        "_ttl2"
      );
    });
  });

  describe("On Mobile", () => {
    beforeAll(() => {
      vi.spyOn(window, "innerWidth", "get").mockReturnValue(1023);
      theAuthLayout = mount(TheAuthLayout, {
        global: {
          stubs: ["RouterView"],
        },
      });
    });

    afterAll(() => {
      vi.clearAllMocks();
    });

    it("should render the router-view component", () => {
      expect(theAuthLayout.findComponent("router-view-stub").exists()).toBe(
        false
      );
    });

    it("should render the mobile layout component", () => {
      expect(theAuthLayout.findComponent(MobileLayout).exists()).toBe(true);
    });

    it("should display the form when we click on the get started button", async () => {
      theAuthLayout.findComponent(MobileLayout).vm.$emit("getStarted");
      await nextTick();
      expect(theAuthLayout.findComponent("router-view-stub").exists()).toBe(
        true
      );
      expect(theAuthLayout.findComponent(MobileLayout).exists()).toBe(false);
    });
  });
});
