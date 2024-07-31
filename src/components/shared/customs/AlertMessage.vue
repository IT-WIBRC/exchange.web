<template>
  <div
    class="text-white bg-red-600 font-Kumbh font-normal text-xs md:text-sm p-2.5 rounded-xl first-letter:uppercase"
  >
    {{ message }}
  </div>
</template>
<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>
