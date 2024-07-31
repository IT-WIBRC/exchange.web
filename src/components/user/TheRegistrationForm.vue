<template>
  <div class="h-full md:px-10 lg:flex lg:items-center lg:justify-center">
    <div class="py-10 px-4 font-Kumbh lg:w-4/5">
      <div>
        <h1
          class="font-semibold text-2.5xl md:text-5xl lg:text-3xl 2xl:text-4xl"
          data-test="title"
        >
          <span>{{ t("registration._ttl") }}</span>
          <BaseImage
            name="logo.svg"
            class="inline h-12 w-24 md:h-20 md:w-36 lg:h-14 lg:w-28 2xl:h-16 2xl:w-32"
          />
        </h1>
        <p
          class="text-[#566576] font-normal text-xs md:text-base lg:text-base"
          data-test="description"
        >
          {{ t("registration._desc") }}
        </p>
      </div>
      <form
        class="py-6 md:py-10 border-b-2 border-[#8998A9]/40 space-y-6 lg:space-y-10 font-Kumbh"
        autocomplete="off"
        @submit.prevent="registration"
      >
        <div class="space-y-5">
          <AlertMessage
            v-if="errorMessage"
            :message="errorMessage"
            class="w-max mx-auto"
            data-test="alert-message"
          />
          <TextInput
            :label="t('fields.username._lbl')"
            :placeholder="t('fields.username._ph')"
            v-model="userToCreate.username"
            :errors="v$.username.$errors"
            data-test="username-input"
          />
          <EmailField
            :label="t('fields.email._lbl')"
            :placeholder="t('fields.email._ph')"
            v-model="userToCreate.email"
            :errors="v$.email.$errors"
            data-test="email-input"
          />
          <PasswordField
            :label="t('fields.password._lbl')"
            :placeholder="t('fields.password._ph')"
            v-model="userToCreate.password"
            :errors="v$.password.$errors"
            data-test="password-input"
          />
        </div>
        <div>
          <button
            class="bg-[#711fff] text-white text-center h-12 rounded-xl w-full font-normal text-lg uppercase"
            type="submit"
            data-test="registration-btn"
            @click="registration"
          >
            <FadeCircleLoader v-if="isLoading" />
            <span v-else>{{ t("registration._btn") }}</span>
          </button>
        </div>
      </form>
      <div class="py-4 space-x-2 flex">
        <p
          class="text-[#566576] text-[13px] md:text-base font-Kumbh"
          data-test="no-account"
        >
          {{ t("registration.no_account") }}
        </p>
        <button
          class="text-orange-700 underline text-[13px] lg:text-base first-letter:uppercase"
          data-test="go-to-login"
        >
          {{ t("login._btn") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import i18nMessages from "./i18n.json";
import EmailField from "@/components/shared/forms/EmailField.vue";
import PasswordField from "@/components/shared/forms/PasswordField.vue";
import TextInput from "@/components/shared/forms/TextInput.vue";
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  email,
  helpers,
  maxLength,
  minLength,
  required,
} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import FadeCircleLoader from "@/components/shared/loaders/FadeCircleLoader.vue";
import AlertMessage from "@/components/shared/customs/AlertMessage.vue";
import { validators } from "@/helpers/validators";
import { useUserStore } from "@/infra/stores/user.store";
import { newNullUserForCreation } from "@/infra/api/domains/User.domain";
import { StorageLocal } from "@/infra/utils/types";
import BaseImage from "../shared/customs/BaseImage.vue";

const { t } = useI18n({
  messages: i18nMessages,
});

const userToCreate = reactive({
  email: "",
  username: "",
  password: "",
});

const { passwordValidator, usernameValidator } = validators;

const rules = computed(() => ({
  username: {
    required: helpers.withMessage(
      t("fields.username.errors.required"),
      required
    ),
    usernameValidator: helpers.withMessage(
      t("fields.username.errors.format"),
      usernameValidator
    ),
    minLength: helpers.withMessage(
      t("fields.username.errors.min_length"),
      minLength(6)
    ),
    maxLength: helpers.withMessage(
      t("fields.username.errors.max_length"),
      maxLength(12)
    ),
  },
  email: {
    required: helpers.withMessage(t("fields.email.errors.required"), required),
    email: helpers.withMessage(t("fields.email.errors.valid_pattern"), email),
  },
  password: {
    required: helpers.withMessage(
      t("fields.password.errors.required"),
      required
    ),
    passwordValidator: helpers.withMessage(
      t("fields.password.errors.valid_pattern"),
      passwordValidator
    ),
  },
}));

const v$ = useVuelidate(rules, userToCreate);
const isLoading = ref<boolean>(false);
const userStore = useUserStore();
const errorMessage = ref("");
const router = useRouter();
const registration = async (): Promise<void> => {
  const isFormValid = await v$.value.$validate();
  if (isFormValid) {
    const newUser = newNullUserForCreation();
    newUser.isNull = false;
    newUser.email = userToCreate.email;
    newUser.password = userToCreate.password;
    newUser.username = userToCreate.username;

    userStore.apiError.message = "";
    await userStore.createUserAccount(newUser);
    if (userStore.apiError.message) {
      errorMessage.value = userStore.apiError.message;
    } else {
      localStorage.setItem(StorageLocal.AUTH_USER, userToCreate.email);
      await router.push("/otp");
    }
  }
  isLoading.value = false;
};
</script>
<style scoped>
.gradient-text {
  background: -webkit-linear-gradient(to right bottom, #ff6fd8, #711fff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
