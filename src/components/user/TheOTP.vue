<template>
  <div
    class="h-full py-8 flex flex-col items-center gap-y-5 lg:justify-center xl:gap-y-8"
  >
    <BaseImage name="logo.svg" class="w-24 sm:w-32 mx-auto xl:w-48" />
    <div
      class="space-y-10 md:w-[500px] xl:w-[430px] 2xl:w-[500px] md:space-y-12"
    >
      <form
        autocomplete="off"
        @submit.prevent="sendOtp"
        class="space-y-4 xl:space-y-6"
      >
        <div class="text-center space-y-3.5 md:space-y-4">
          <h1
            class="font-bold text-2xl sm:text-3xl xl:text-4xl font-Kumbh"
            data-test="title"
          >
            {{ t("otp._ttl") }}
          </h1>
          <p
            class="font-normal text-[#3F3D56] text-xs md:text-base font-Kumbh"
            data-test="description"
          >
            {{ t("otp._desc") }}
          </p>
        </div>
        <div class="space-y-6 md:space-y-6 px-14">
          <AlertMessage
            v-if="errorMessage"
            :message="errorMessage"
            data-test="alert-message"
            class="w-max mx-auto"
          />
          <div class="text-center space-y-4 lg:space-y-8 xl:space-y-10">
            <p
              class="text-center font-semibold text-sm lg:text-base font-Kumbh"
              data-test="email"
            >
              {{ userEmail }}
            </p>

            <OTPField
              v-model="otpCode"
              :label="t('otp.fill_lbl')"
              :has-error="!!errorMessage"
              :discount="OTP_DIGITS_NUMBER"
              :disabled="expirationTime === 0"
              data-test="otp-field"
            />

            <TheTimer
              :duration="expirationTime"
              class="pt-4 xl:pt-0 text-2xl xl:text-3xl"
              @remaining-time="(time) => (expirationTime = time)"
            />
          </div>

          <div class="space-y-5 xl:px-8 xl:space-y-6">
            <div
              class="text-center max-sm:text-sm text-gray-450 font-Kumbh flex gap-x-2 justify-center"
              data-test="resend-code"
            >
              <span class="text-gray-600">{{ t("otp.not_get") }}</span>
              <span
                class="text-orange-500 font-medium mr-2 cursor-pointer transition-all duration-100 ease font-Kumbh flex"
                @click.prevent="resendCode"
                data-test="btn"
              >
                {{ t("otp.resend") }}
                <template v-if="!isResendCodeLoading && isResendOk">
                  <span v-if="errorMessage" data-test="failure">❌</span>
                  <span v-else data-test="success">✅</span>
                </template>
                <FadeCircleLoader
                  v-if="isResendCodeLoading"
                  class="h-4 w-4 before:w-4 before:h-4 before:border-t-orange-500"
                />
              </span>
            </div>
            <button
              class="text-center bg-blue-500 rounded-xl font-medium font-Kumbh text-white py-3.5 md:py-4 xl:py-4 rounded-4xl text-sm md:text-base 2xl:text-lg w-full flex items-center justify-center disabled:bg-blue-300 disabled:text-gray-100 disabled:cursor-not-allowed"
              type="submit"
              :disabled="
                isLoading ||
                otpCode.length < OTP_DIGITS_NUMBER ||
                expirationTime === 0
              "
              data-test="send-otp-btn"
            >
              <FadeCircleLoader
                v-if="isLoading"
                class="h-6 w-6 before:w-6 before:h-6"
              />
              <span v-else>{{ t("otp._btn") }}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import i18nMessages from "./i18n.json";
import BaseImage from "@/components/shared/customs/BaseImage.vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { StorageLocal } from "@/infra/utils/types";
import { useUserStore } from "@/infra/stores/user.store";
import OTPField from "@/components/shared/forms/OTPField.vue";
import TheTimer from "@/components/shared/forms/TheTimer.vue";
import AlertMessage from "@/components/shared/customs/AlertMessage.vue";
import FadeCircleLoader from "@/components/shared/loaders/FadeCircleLoader.vue";

const { t } = useI18n({
  messages: i18nMessages,
});

const userEmail = ref<string>("");
onMounted(() => {
  userEmail.value = localStorage.getItem(StorageLocal.AUTH_USER) ?? "";
});

const otpCode = ref<string>("");

const isLoading = ref<boolean>(false);
const userStore = useUserStore();
const errorMessage = ref("");
const router = useRouter();
const sendOtp = async (): Promise<void> => {
  userStore.apiError.message = "";
  isLoading.value = true;
  await userStore.enableUser(otpCode.value, userEmail.value);
  if (!userStore.apiError.message) {
    await router.push("/login");
  } else {
    errorMessage.value = userStore.apiError.message;
  }
  isLoading.value = false;
};

const OTP_EXPIRATION_TIME_IN_SECONDS = 600;
const OTP_DIGITS_NUMBER = 6;
const expirationTime = ref(OTP_EXPIRATION_TIME_IN_SECONDS);
const isResendOk = ref(false);
const isResendCodeLoading = ref(false);
const resendCode = async (): Promise<void> => {
  userStore.apiError.message = "";
  errorMessage.value = "";
  if (!isResendOk.value) {
    isResendCodeLoading.value = true;
    await userStore.resendOtp(userEmail.value);
    isResendCodeLoading.value = false;
    if (!userStore.apiError.message) {
      expirationTime.value = OTP_EXPIRATION_TIME_IN_SECONDS;
    } else {
      errorMessage.value = userStore.apiError.message;
    }

    isResendOk.value = true;
    setTimeout(() => {
      isResendOk.value = false;
    }, 180_000);
  }
};
</script>
