<template>
  <img
    :src="spinner"
    alt="Loading"
    :class="['spinner-rotate-once', className]"
    :style="{ width: size, height: size }"
  />
</template>

<script>
import spinner from "@/assets/icons/common/button-loading.svg?url";

export default {
  name: "LoadingSpinner",
  data() {
    return {
      spinner,
    };
  },
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
