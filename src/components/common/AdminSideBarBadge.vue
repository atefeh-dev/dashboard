<template>
  <div class="admin-badge">
    <div class="admin-badge__icon">
      <AdministratorBadgeIcon />
    </div>
    <span class="admin-badge__label">Administrator</span>
  </div>
</template>

<script setup>
import AdministratorBadgeIcon from "../../assets/icons/sidebar/administrator-badge.svg";
</script>

<style scoped lang="scss">
.admin-badge {
  display: inline-flex;
  align-items: center;
  width: 100%;
  gap: 0.5rem; // 8px
  padding: 0.5rem 0.75rem; // 8px 12px
  background-color: #fafafa;
  border-radius: 0.375rem; // 6px
  margin-bottom: 1rem;

  &__label {
    font-size: 1rem; // 14px
    font-weight: 600;
    color: #4539cc; // Indigo 700
  }
}
</style>
