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
                  <FileTypeIcon class="template-name__icon" />
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
import FileTypeIcon from "@/assets/icons/common/file-type-icon.svg";

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
const TAG_COLOR_ORDER = [
  "sugarCrystal",
  "Seashell",
  "pinkishWhite",
  "aliceBlue",
];

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
  &__cell {
    vertical-align: middle !important; // Override mixin's 'top'
    &:first-child {
      padding: 1rem 1.5rem 1rem 1.25rem;
    }
  }

  &__actions {
    gap: 0.5rem !important;
  }

  // Override tag colors ONLY in this component
  &__tag {
    font-weight: 500;
    font-size: 0.75rem;
    border-radius: 50px;
    padding: 0.125rem 0.5rem;

    // sugarCrystal tags (Purple)
    &--sugarCrystal {
      background-color: #f9f5ff;
      color: #6941c6;
      border-color: #e9d7fe;
    }

    // aliceBlue tags (Blue)
    &--aliceBlue {
      background-color: #eff8ff;
      color: #175cd3;
      border-color: #b2ddff;
    }

    // pinkishWhite tags (Pink)
    &--pinkishWhite {
      background-color: #fdf2fa;
      color: #c11574;
      border-color: #fcceee;
    }

    // Seashell tags (Orange)
    &--Seashell {
      background-color: #fef6ee;
      color: #b93815;
      border-color: #f9dbaf;
    }
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
