<template>
  <div class="notification-row">
    <span class="notification-row__label">{{ label }}</span>
    <div class="notification-row__controls">
      <button
        v-for="(option, index) in options"
        :key="option"
        @click="$emit('update', option)"
        :class="[
          'notification-row__button',
          {
            'notification-row__button--active': selected === option,
            'notification-row__button--with-divider':
              index !== options.length - 1,
          },
        ]"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  selected: {
    type: String,
    default: "None",
  },
});

defineEmits(["update"]);

const options = ["None", "In-app", "Email"];
</script>

<style scoped lang="scss">
.notification-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  gap: 1rem;

  @media (min-width: 640px) {
    align-items: flex-start;
    min-height: 3.5rem;
  }

  @media (max-width: 639px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  &__label {
    font-size: 0.875rem;
    color: #414651;
    line-height: 1.5;
    flex-shrink: 1;
    min-width: 0;

    @media (min-width: 640px) {
      padding-top: 0.375rem;
    }

    @media (max-width: 639px) {
      width: 100%;
      padding-top: 0;
    }
  }

  &__controls {
    display: inline-flex;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    // padding: 0.5rem 1rem;
    box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);
    flex-shrink: 0;

    @media (max-width: 639px) {
      width: 100%;
      display: flex;
    }
  }

  &__button {
    position: relative;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.375rem;
    transition: all 0.2s;
    white-space: nowrap;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #414651;

    @media (max-width: 639px) {
      flex: 1;
      padding: 0.5rem 0.5rem;
      font-size: 0.8125rem;
    }

    &:hover {
      color: #111827;
    }

    &--active {
      background-color: #fafafa;
      color: #252b37;
    }

    &--with-divider::after {
      content: "";
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background-color: #e5e7eb;

      @media (max-width: 639px) {
        display: none;
      }
    }
  }
}
</style>
