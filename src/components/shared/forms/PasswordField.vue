<template>
  <div>
    <label class="block">
      <span
        class="block text-sm md:text-base font-medium text-slate-900 first-letter:uppercase"
        data-test="label"
      >
        {{ label }}
        <span v-if="isRequired" data-test="wildcard" class="text-red-600"
          >*</span
        >
      </span>
      <div class="relative">
        <input
          :type="inputType"
          v-model="model"
          :placeholder="placeholder"
          :required="isRequired"
          :class="[
            'mt-1 block w-full px-5 font-Poppins py-3 border-none rounded-xl text-sm md:text-base shadow-sm focus:outline-none placeholder-slate-500 focus:bg-[#F6F1FF]',
            errors.length || hasError
              ? 'bg-[#FCDEE4]'
              : 'bg-[#F7F8F9] text-[#1C1C1E]',
          ]"
          autocomplete="off"
        />
        <span
          class="absolute right-4 top-3 cursor-pointer"
          @click.prevent="
            inputType = inputType === 'password' ? 'text' : 'password'
          "
          :data-test="inputType === 'password' ? 'show' : 'hide'"
        >
          <i class="material-icons" v-if="inputType === 'password'"
            >visibility_off</i
          >
          <i v-else class="material-icons">visibility</i>
        </span>
      </div>
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
import { ref } from "vue";
defineProps<{
  label: string;
  placeholder: string;
  errors: ErrorObject[];
  isRequired?: boolean;
  hasError?: boolean;
}>();

// eslint-disable-next-line no-undef
const model = defineModel<string>({ required: true });

const inputType = ref<"text" | "password">("password");
</script>
