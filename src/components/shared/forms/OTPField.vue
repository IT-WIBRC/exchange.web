<template>
  <div class="space-y-3.5">
    <label class="text-sm font-Kumbh text-[#161312] first-letter:uppercase">{{
      label
    }}</label>
    <div class="flex gap-x-2 justify-center flex-wrap gap-y-2">
      <input
        v-for="(otp, index) in discount"
        :key="otp + index"
        type="text"
        v-model="otpValue[index]"
        :autofocus="index === 0"
        :disabled="disabled"
        @keydown.prevent="handleInput($event, index)"
        maxlength="1"
        :class="[
          'block w-10 2xl:w-12 text-center font-Kumbh py-3 border-none shadow rounded-xl text-sm md:text-base focus:outline-none placeholder-slate-500 focus:bg-[#F6F1FF] disabled:bg-gray-100 disabled:cursor-not-allowed',
          hasError ? 'bg-[#FCDEE4]' : 'bg-[#F7F8F9] text-[#1C1C1E]',
        ]"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  discount: {
    type: Number,
    default: 5,
  },
  modelValue: {
    type: String,
    required: true,
  },
  hasError: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const otpValue = reactive<string[]>([]);

// eslint-disable-next-line no-undef
const otpInputs = ref<NodeListOf<HTMLInputElement>>();

onMounted(() => {
  otpInputs.value = document.querySelectorAll("input");
});

const handleInput = (event: KeyboardEvent, index: number) => {
  if (event.key === "Backspace") {
    otpValue[index] = "";

    if (index !== 0) {
      otpInputs.value?.[index - 1].focus();
    }

    return;
  }

  if (/^([0-9])$/.test(event.key)) {
    otpValue[index] = event.key;

    emit("update:modelValue", otpValue.join(""));

    if (index !== props.discount - 1) {
      otpInputs.value?.[index + 1].focus();
    }
  }
};
</script>
