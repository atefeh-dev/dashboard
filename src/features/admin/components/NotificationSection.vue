<template>
  <div class="notification-section">
    <div class="notification-section__row">
      <!-- Left: Section Description -->
      <div class="notification-section__left">
        <h2 class="notification-section__title">{{ title }}</h2>
        <p class="notification-section__description">{{ description }}</p>
      </div>

      <!-- Right: First Row -->
      <div class="notification-section__right">
        <NotificationRowSimple
          :label="rows[0].label"
          :selected="getSelected(rows[0].key)"
          @update="handleUpdate(rows[0].key, $event)"
        />
      </div>
    </div>

    <!-- Remaining rows -->
    <div class="notification-section__row notification-section__row--no-title">
      <div class="notification-section__spacer"></div>
      <div class="notification-section__right">
        <div class="notification-section__list">
          <template v-for="row in remainingRows" :key="row.key">
            <div class="notification-section__divider"></div>
            <NotificationRowSimple
              :label="row.label"
              :selected="getSelected(row.key)"
              @update="handleUpdate(row.key, $event)"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import NotificationRowSimple from "./NotificationRowSimple.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update"]);

const remainingRows = computed(() => props.rows.slice(1));

const getSelected = (key) => {
  return props.modelValue?.[key] || "None";
};

const handleUpdate = (key, value) => {
  emit("update", { key, value });
};
</script>

<style scoped lang="scss">
.notification-section {
  margin-bottom: 3rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 639px) {
    margin-bottom: 2rem;
  }

  &__row {
    display: flex;
    gap: 2rem;
    align-items: flex-start;

    @media (min-width: 768px) and (max-width: 1199px) {
      gap: 1rem;
    }

    @media (max-width: 767px) {
      flex-direction: column;
      gap: 1rem;
    }

    &--no-title {
      @media (max-width: 767px) {
        .notification-section__spacer {
          display: none;
        }
      }
    }
  }

  &__left {
    width: 280px;
    flex-shrink: 0;

    @media (min-width: 1200px) and (max-width: 1599px) {
      width: 240px;
    }

    @media (min-width: 768px) and (max-width: 1199px) {
      width: 200px;
    }

    @media (max-width: 767px) {
      width: 100%;
    }
  }

  &__title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #414651;
    margin-bottom: 0.25rem;
    line-height: 1.4;

    @media (min-width: 768px) and (max-width: 1199px) {
      font-size: 0.8125rem;
    }
  }

  &__description {
    font-size: 0.875rem;
    color: #535862;
    font-weight: 400;
    line-height: 1.5;

    @media (min-width: 768px) and (max-width: 1199px) {
      font-size: 0.8125rem;
      line-height: 1.4;
    }
  }

  &__right {
    flex: 1;
    min-width: 0;
    width: 100%;

    @media (max-width: 639px) {
      width: 100%;
    }
  }

  &__spacer {
    width: 280px;
    flex-shrink: 0;

    @media (min-width: 1200px) and (max-width: 1599px) {
      width: 240px;
    }

    @media (min-width: 768px) and (max-width: 1199px) {
      width: 200px;
    }

    @media (max-width: 767px) {
      display: none;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
  }

  &__divider {
    border-top: 1px solid #e5e7eb;
  }
}
</style>
