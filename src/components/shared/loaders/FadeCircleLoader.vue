<template>
  <div
    class="loader before:content-[''] before:absolute before:rounded-[50%] before:border-t-2 before:border-t-white before:border-r-2 before:border-r-transparent"
  ></div>
</template>
<style scoped>
.loader::before {
  animation: spinner8217 0.8s linear infinite;
}

@keyframes spinner8217 {
  to {
    transform: rotate(360deg);
  }
}
</style>
