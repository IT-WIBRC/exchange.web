import {
  vi,
  describe,
  afterAll,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";
import TheTimer from "@/components/shared/forms/TheTimer.vue";
import { nextTick } from "vue";

describe("TheTimer", () => {
  let theTimer: VueWrapper;

  beforeEach(() => {
    vi.useFakeTimers();
    theTimer = mount(TheTimer, {
      props: {
        duration: 300,
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  afterAll(() => {
    vi.clearAllTimers();
  });

  it("should render correctly", () => {
    expect(theTimer.exists()).toBe(true);
  });

  it("should display the time correctly", async () => {
    expect(theTimer.find("[data-test='minutes']").text()).toBe("05");
    expect(theTimer.find("[data-test='seconds']").text()).toBe("00");

    vi.advanceTimersByTime(105000);
    await nextTick();

    expect(theTimer.find("[data-test='minutes']").text()).toBe("03");
    expect(theTimer.find("[data-test='seconds']").text()).toBe("15");

    vi.advanceTimersByTime(8000);
    await nextTick();

    expect(theTimer.find("[data-test='minutes']").text()).toBe("03");
    expect(theTimer.find("[data-test='seconds']").text()).toBe("07");
  });

  it("should emit the elapsed time each second", () => {
    vi.advanceTimersByTime(1000);
    expect(theTimer.emitted()).toHaveProperty("remainingTime", [[299]]);

    vi.advanceTimersByTime(1000);
    expect(theTimer.emitted()).toHaveProperty("remainingTime", [[299], [298]]);
  });

  it("should stop the timer at the end of the time", () => {
    vi.advanceTimersByTime(60000);
    expect(theTimer.emitted()["remainingTime"].length).toBe(60);

    vi.advanceTimersByTime(2000000);

    expect(theTimer.emitted()["remainingTime"].length).toBe(300);
  });

  it.todo("should restart the timer when the duration change", async () => {
    expect(theTimer.find("[data-test='minutes']").text()).toBe("05");
    expect(theTimer.find("[data-test='seconds']").text()).toBe("00");

    vi.advanceTimersByTime(105000);
    await nextTick();

    expect(theTimer.find("[data-test='minutes']").text()).toBe("03");
    expect(theTimer.find("[data-test='seconds']").text()).toBe("15");

    await theTimer.setProps({
      duration: 300,
    });
    await nextTick();

    expect(theTimer.find("[data-test='minutes']").text()).toBe("05");
    expect(theTimer.find("[data-test='seconds']").text()).toBe("00");
  });
});
