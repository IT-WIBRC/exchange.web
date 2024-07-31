import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import FadeCircleLoader from "../FadeCircleLoader.vue";

describe("FadeCircleLoader", () => {
  it("should render correctly", () => {
    expect(mount(FadeCircleLoader).exists()).toBe(true);
  });
});
