<template>
  <div class="min-h-svh flex flex-col">
    <MobileLayout
      v-if="isMobile && !shouldDisplayFormOnMobile"
      class="min-h-svh max-h-svh overflow-y-auto scroll gradient"
      @getStarted="shouldDisplayFormOnMobile = true"
    />
    <div v-else class="h-full grow flex">
      <section class="lg:w-1/2 h-svh w-full">
        <RouterView />
      </section>
      <section class="hidden lg:block lg:w-1/2 gradient lg:h-svh">
        <div
          class="text-white font-Kumbh pb-12 flex flex-col justify-between h-full"
        >
          <div class="flex justify-center 2xl:justify-end px-2 pt-3">
            <BaseImage name="saly.svg" class="h-full w-3/5" />
          </div>
          <div class="px-20 space-y-5 2xl:w-4/5 2xl:-translate-y-36">
            <div class="space-y-2.5">
              <h3 class="font-normal text-sm" data-test="level3-title">
                {{ t("_ttl3") }}
              </h3>
              <h1
                class="text-4xl 2xl:text-5xl font-semibold"
                data-test="level-title"
              >
                {{ t("_ttl") }}
              </h1>
              <h2
                class="text-base 2xl:text-lg font-normal"
                data-test="level2-title"
              >
                {{ t("_ttl2") }}
              </h2>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import MobileLayout from "@/components/auth/MobileLayout.vue";
import { useI18n } from "vue-i18n";
import i18nMessages from "./i18n.json";
import BaseImage from "@/components/shared/customs/BaseImage.vue";

const { t } = useI18n({
  messages: i18nMessages,
});

const isMobile = ref(false);
const shouldDisplayFormOnMobile = ref(false);
const resizeScreen = (): void => {
  isMobile.value = window.innerWidth < 1024;
};
onMounted(() => {
  resizeScreen();
  window.addEventListener("resize", resizeScreen);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeScreen);
});
</script>
<style scoped>
.gradient {
  background: linear-gradient(to right bottom, #ff6fd8, #711fff);
}
</style>
