<template>
  <img
    src="../../assets/icons/common/button-loading.svg"
    alt="Loading"
    :class="['spinner-rotate-once', className]"
    :style="{ width: size, height: size }"
  />
</template>

<script>
export default {
  name: "LoadingSpinner",
  props: {
    size: {
      type: String,
      default: "20px",
    },
    className: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
.spinner-rotate-once {
  animation: rotateOnce 0.6s ease-in-out;
}

@keyframes rotateOnce {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
