<template>
  <main class="notifications-content">
    <div class="notifications-content__container">
      <div class="notifications-content__header">
        <h1 class="notifications-content__title">Notifications</h1>
        <p class="notifications-content__subtitle">
          Select when and how you'll be notified.
        </p>
      </div>

      <!-- General Notifications Section -->
      <NotificationSection
        title="General notifications"
        description="Select when you'll be notified when the following changes occur."
        :rows="generalRows"
        :modelValue="generalNotifications"
        @update="handleGeneralUpdate"
      />

      <!-- Big horizontal divider -->
      <div class="notifications-content__big-divider"></div>

      <!-- Summary Notifications Section -->
      <NotificationSection
        title="Summary notifications"
        description="Select when you'll be notified when the following summaries or report are ready."
        :rows="summaryRows"
        :modelValue="summaryNotifications"
        @update="handleSummaryUpdate"
      />
    </div>
  </main>
</template>

<script setup>
import { computed } from "vue";
import NotificationSection from "./NotificationSection.vue";

const props = defineProps({
  generalNotifications: {
    type: Object,
    required: true,
  },
  summaryNotifications: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  "update:generalNotifications",
  "update:summaryNotifications",
]);

const generalRows = computed(() => [
  { key: "mentioned", label: "I'm mentioned in a message" },
  { key: "replies", label: "Someone replies to any message" },
  { key: "assigned", label: "I'm assigned a task" },
  { key: "overdue", label: "A task is overdue" },
  { key: "taskStatus", label: "A task status is updated" },
]);

const summaryRows = computed(() => [
  { key: "daily", label: "Daily summary" },
  { key: "weekly", label: "Weekly summary" },
  { key: "monthly", label: "Monthly summary" },
  { key: "quarterly", label: "Quarterly summary" },
]);

const handleGeneralUpdate = ({ key, value }) => {
  emit("update:generalNotifications", {
    ...props.generalNotifications,
    [key]: value,
  });
};

const handleSummaryUpdate = ({ key, value }) => {
  emit("update:summaryNotifications", {
    ...props.summaryNotifications,
    [key]: value,
  });
};
</script>

<style scoped lang="scss">
.notifications-content {
  flex: 1;
  min-width: 0;
  padding: 2rem;
  background-color: #f9fafb;
  overflow-x: hidden;

  @media (max-width: 1023px) {
    padding: 2rem 1.5rem;
  }

  @media (max-width: 639px) {
    padding: 1.5rem 1rem;
  }

  &__container {
    max-width: 100%;
    width: 100%;
  }

  &__header {
    margin-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;
    max-width: 100%;

    @media (max-width: 639px) {
      margin-bottom: 2rem;
    }
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #181d27;
    margin-bottom: 0.5rem;
    line-height: 1.2;

    @media (max-width: 639px) {
      font-size: 1.5rem;
    }
  }

  &__subtitle {
    font-size: 1rem;
    color: #535862;
    line-height: 1.5;
    padding-bottom: 1.063rem;
  }

  &__big-divider {
    border-top: 1px solid #e5e7eb;
    margin-bottom: 3rem;
    max-width: calc(280px + 2rem + 512px);

    @media (min-width: 768px) and (max-width: 1199px) {
      max-width: calc(180px + 1rem + 512px);
    }

    @media (max-width: 767px) {
      margin-bottom: 2rem;
      max-width: 100%;
    }
  }
}
</style>
