<template>
  <div class="">
    <label class="block">
      <span
        class="block text-sm md:text-base font-medium text-slate-900 first-letter:uppercase"
      >
        {{ label }}
        <span v-if="isRequired" data-test="wildcard" class="text-red-600"
          >*</span
        >
      </span>
      <input
        type="email"
        v-model="model"
        :placeholder="placeholder"
        :required="isRequired"
        :class="[
          'mt-1 block w-full px-5 font-Poppins py-3 border-none rounded-xl text-sm md:text-base shadow-sm focus:outline-none placeholder-slate-500 focus:bg-[#F6F1FF]',
          errors.length || hasError
            ? 'bg-[#FCDEE4]'
            : 'bg-[#F7F8F9] text-[#1C1C1E]',
        ]"
      />
      <p
        class="mt-2 text-pink-600 text-xs"
        v-if="errors.length"
        data-test="error"
      >
        {{ errors[0].$message }}
      </p>
    </label>
  </div>
</template>
<script setup lang="ts">
import { ErrorObject } from "@vuelidate/core";
defineProps<{
  label: string;
  placeholder: string;
  errors: ErrorObject[];
  isRequired?: boolean;
  hasError?: boolean;
}>();

//border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500
// eslint-disable-next-line no-undef
const model = defineModel<string>({ required: true });
</script>
