<template>
  <div class="text-[#3F3D56] font-bold font-Kumbh">
    <span data-test="minutes">{{ getTime.minutes }}</span>
    <span>:</span>
    <span data-test="seconds">{{ getTime.seconds }}</span>
  </div>
</template>
<script setup lang="ts">
import { watch } from "vue";
import { computed, ref } from "vue";

const props = defineProps<{
  duration: number;
}>();
const emit = defineEmits<{
  (e: "remainingTime", remainingTime: number): void;
}>();

const currentTime = ref(0);

let interval: ReturnType<typeof setInterval>;
interval = setInterval(() => {
  currentTime.value = currentTime.value - 1;

  emit("remainingTime", currentTime.value);

  if (currentTime.value === 0) {
    clearInterval(interval);
  }
}, 1000);

type Time = {
  minutes: string;
  seconds: string;
};
const getTime = computed<Time>(() => {
  return {
    minutes: `0${Math.floor(currentTime.value / 60)}`.slice(-2),
    seconds: `0${currentTime.value % 60}`.slice(-2),
  };
});

watch(
  () => props.duration,
  (value, oldValue) => {
    if (value === oldValue) return;
    currentTime.value = value;
  },
  {
    immediate: true,
  }
);
</script>
