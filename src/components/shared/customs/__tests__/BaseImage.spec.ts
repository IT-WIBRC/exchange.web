import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import BaseImage from "../BaseImage.vue";

describe("BaseImage", () => {
  const baseImage = mount(BaseImage, {
    props: {
      name: "logo.svg",
      fetchPriority: "low",
    },
  });

  it("should render correctly", () => {
    expect(baseImage.exists()).toBe(true);
  });

  it("should contain an image tag with the awaited attributes", () => {
    const image = baseImage.find("img");
    expect(image.element.src).toContain("/assets/logo.svg");
    expect(image.element.alt).toBe("The image provided is not right");
  });

  it("should return the url in priority", () => {
    const baseImage = mount(BaseImage, {
      props: {
        name: "logo",
        fetchPriority: "low",
        url: "/image/url",
      },
    });
    const image = baseImage.find("img");
    expect(image.element.src).toContain("/image/url");
  });
});
