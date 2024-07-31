<template>
  <div class="text-white font-Kumbh flex flex-col justify-between pb-7">
    <div class="h-3/6 flex justify-end px-2 pt-3">
      <BaseImage name="saly.svg" class="h-full w-9/12 sm:w-11/12 md:w-7/12" />
    </div>
    <div class="px-4 space-y-5 md:w-4/5 md:mx-auto md:space-y-2">
      <div class="space-y-2.5">
        <h3 class="font-normal text-xs md:text-base" data-test="level3-title">
          {{ t("_ttl3") }}
        </h3>
        <h1 class="text-3xl md:text-5xl font-semibold" data-test="level1-title">
          {{ t("_ttl") }}
        </h1>
        <h2 class="text-xs md:text-base font-normal" data-test="level2-title">
          {{ t("_ttl2") }}
        </h2>
      </div>
      <div>
        <button
          class="font-Kumbh font-semibold uppercase w-full h-12 bg-white text-black rounded-xl"
          @click.stop="$emit('getStarted')"
          data-test="get-started-btn"
          data-cy="get-started-btn"
        >
          {{ t("get_started_btn") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import i18nMessages from "./i18n.json";
import BaseImage from "@/components/shared/customs/BaseImage.vue";

defineEmits(["getStarted"]);
const { t } = useI18n({
  messages: i18nMessages,
});
</script>
