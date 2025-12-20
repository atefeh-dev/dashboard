<template>
  <div class="table-card">
    <div class="template-table">
      <div class="template-table__wrapper">
        <table class="template-table__table">
          <thead class="template-table__head">
            <tr class="template-table__row template-table__row--header">
              <th class="template-table__header">Name</th>
              <th class="template-table__header">Author</th>
              <th class="template-table__header">Last update</th>
              <th class="template-table__header">Tag</th>
              <th class="template-table__header">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="template in templates"
              :key="template.id"
              class="template-table__row"
              :class="{
                'template-table__row--selected':
                  selectedTemplate?.id === template.id,
              }"
            >
              <td class="template-table__cell">
                <div class="template-name">
                  <FileText class="template-name__icon" />
                  <span class="template-table__name">
                    {{ template.name }}
                  </span>
                </div>
              </td>

              <td class="template-table__cell template-table__domain">
                {{ template.author }}
              </td>

              <td class="template-table__cell template-table__date">
                {{ template.lastUpdate }}
              </td>

              <td class="template-table__cell">
                <!-- Show first 4 tags instead of 3 -->
                <div class="template-table__categories">
                  <span
                    v-for="(tag, idx) in template.tags.slice(0, 4)"
                    :key="idx"
                    class="template-table__tag"
                    :class="`template-table__tag--${getTagColor(tag, idx)}`"
                  >
                    {{ tag }}
                  </span>

                  <span
                    v-if="template.tags.length > 4"
                    class="template-table__badge"
                  >
                    +{{ template.tags.length - 4 }}
                  </span>
                </div>
              </td>

              <td class="template-table__cell">
                <div class="template-table__actions">
                  <AppButton
                    variant="ghost"
                    size="sm"
                    @click="handlePreview(template)"
                  >
                    Preview
                  </AppButton>
                  <AppButton
                    variant="primary"
                    size="sm"
                    @click="handleSelect(template)"
                  >
                    Use
                  </AppButton>
                </div>
              </td>
            </tr>

            <tr v-if="templates.length === 0" class="template-table__row">
              <td class="template-table__empty" colspan="5">
                <div class="empty-state">
                  <FileX class="empty-state__icon" />
                  <p class="empty-state__text">
                    No templates found matching your filters
                  </p>
                  <AppButton
                    variant="ghost"
                    size="sm"
                    @click="$emit('clear-filters')"
                  >
                    Clear filters
                  </AppButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup>
import { FileText, FileX } from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";

const props = defineProps({
  templates: {
    type: Array,
    required: true,
  },
  selectedTemplate: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["select", "preview", "clear-filters"]);

// SENIOR APPROACH: Consistent color assignment based on tag name
// Same tag = same color always (deterministic)
const TAG_COLOR_ORDER = ["blue", "purple", "yellow", "green"];

function getTagColor(_, index) {
  return TAG_COLOR_ORDER[index % TAG_COLOR_ORDER.length];
}

function handleSelect(template) {
  emit("select", template);
}

function handlePreview(template) {
  emit("preview", template);
}
</script>

<style scoped lang="scss">
@use "../../../../assets/styles/table-mixins" as *;

// Include base table styles with our prefix
@include table-base-styles("template-table");

.template-table {
  // Override tag colors ONLY in this component
  &__tag {
    font-weight: 500;

    // Blue tags
    &--blue {
      background-color: #eff6ff;
      color: #1e40af;
      border-color: #bfdbfe;
    }

    // Green tags
    &--green {
      background-color: #f0fdf4;
      color: #15803d;
      border-color: #bbf7d0;
    }

    // Yellow tags
    &--yellow {
      background-color: #fefce8;
      color: #a16207;
      border-color: #fde047;
    }

    // Purple tags
    &--purple {
      background-color: #faf5ff;
      color: #7c3aed;
      border-color: #e9d5ff;
    }
  }
  // Action buttons container
  &__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  // Selected row styling
  &__row--selected {
    background-color: #eff6ff;
    border-left: 3px solid #3b82f6;
  }
}

// Template name with icon
.template-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &__icon {
    width: 1rem;
    height: 1rem;
    color: #6b7280;
    flex-shrink: 0;
  }
}

// Empty state
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;

  &__icon {
    width: 3rem;
    height: 3rem;
    color: #d1d5db;
    margin-bottom: 1rem;
  }

  &__text {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1rem;
  }
}

// Table card wrapper
.table-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: #ffffff;
}
</style>
