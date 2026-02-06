<template>
  <div
    class="app-date-picker"
    :class="{
      'app-date-picker--error': error,
      'app-date-picker--disabled': disabled,
    }"
  >
    <!-- Input Field -->
    <div class="dp-input-wrap" @click="toggleCalendar">
      <svg
        class="dp-input-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      <input
        type="text"
        class="dp-input"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        readonly
      />
    </div>

    <!-- Calendar Dropdown -->
    <Teleport to="body">
      <Transition name="dp-fade">
        <div v-if="isOpen" class="dp-overlay" @click="closeCalendar">
          <div class="dp-menu" @click.stop>
            <!-- Header -->
            <div class="dp-header">
              <button type="button" class="dp-nav-btn" @click="prevMonth">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <span class="dp-month-year">{{ monthYearLabel }}</span>
              <button type="button" class="dp-nav-btn" @click="nextMonth">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            <!-- Weekday Headers -->
            <div class="dp-weekdays">
              <span v-for="day in weekdays" :key="day" class="dp-weekday">{{
                day
              }}</span>
            </div>

            <!-- Calendar Grid -->
            <div class="dp-calendar">
              <button
                v-for="(day, index) in calendarDays"
                :key="index"
                type="button"
                class="dp-day"
                :class="{
                  'dp-day--other': day.isOtherMonth,
                  'dp-day--today': day.isToday,
                  'dp-day--selected': day.isSelected,
                  'dp-day--disabled': day.isDisabled,
                }"
                :disabled="day.isDisabled"
                @click="selectDate(day)"
              >
                {{ day.date }}
              </button>
            </div>

            <!-- Action Buttons -->
            <div class="dp-actions">
              <button
                type="button"
                class="dp-action-btn dp-action-btn--clear"
                @click="clearDate"
              >
                Clear
              </button>
              <button
                type="button"
                class="dp-action-btn dp-action-btn--today"
                @click="selectToday"
              >
                Today
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  error: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  min: {
    type: String,
    default: "",
  },
  max: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Select date",
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const selectedDate = computed(() => {
  if (!props.modelValue || props.modelValue.trim() === "") return null;
  try {
    const dateObj = new Date(props.modelValue + "T00:00:00");
    if (isNaN(dateObj.getTime())) return null;
    return dateObj;
  } catch (e) {
    return null;
  }
});

const displayValue = computed(() => {
  if (!selectedDate.value) return "";
  const m = String(selectedDate.value.getMonth() + 1).padStart(2, "0");
  const d = String(selectedDate.value.getDate()).padStart(2, "0");
  const y = selectedDate.value.getFullYear();
  return `${m}/${d}/${y}`;
});

const monthYearLabel = computed(() => {
  return `${monthNames[currentMonth.value]} ${currentYear.value}`;
});

const minDate = computed(() =>
  props.min ? new Date(props.min + "T00:00:00") : null,
);
const maxDate = computed(() =>
  props.max ? new Date(props.max + "T00:00:00") : null,
);

const calendarDays = computed(() => {
  const days = [];
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
  const startPadding = firstDay.getDay();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Previous month days
  const prevMonthLastDay = new Date(
    currentYear.value,
    currentMonth.value,
    0,
  ).getDate();
  for (let i = startPadding - 1; i >= 0; i--) {
    const date = prevMonthLastDay - i;
    const fullDate = new Date(currentYear.value, currentMonth.value - 1, date);
    days.push({
      date,
      fullDate,
      isOtherMonth: true,
      isToday: false,
      isSelected: false,
      isDisabled: isDateDisabled(fullDate),
    });
  }

  // Current month days
  for (let date = 1; date <= lastDay.getDate(); date++) {
    const fullDate = new Date(currentYear.value, currentMonth.value, date);
    const isToday = fullDate.getTime() === today.getTime();
    const isSelected =
      selectedDate.value && fullDate.getTime() === selectedDate.value.getTime();
    days.push({
      date,
      fullDate,
      isOtherMonth: false,
      isToday,
      isSelected,
      isDisabled: isDateDisabled(fullDate),
    });
  }

  // Next month days
  const remainingDays = 42 - days.length;
  for (let date = 1; date <= remainingDays; date++) {
    const fullDate = new Date(currentYear.value, currentMonth.value + 1, date);
    days.push({
      date,
      fullDate,
      isOtherMonth: true,
      isToday: false,
      isSelected: false,
      isDisabled: isDateDisabled(fullDate),
    });
  }

  return days;
});

function isDateDisabled(date) {
  if (minDate.value && date < minDate.value) return true;
  if (maxDate.value && date > maxDate.value) return true;
  return false;
}

function toggleCalendar() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value && selectedDate.value) {
    currentMonth.value = selectedDate.value.getMonth();
    currentYear.value = selectedDate.value.getFullYear();
  }
}

function closeCalendar() {
  isOpen.value = false;
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

function selectDate(day) {
  if (day.isDisabled) return;
  const y = day.fullDate.getFullYear();
  const m = String(day.fullDate.getMonth() + 1).padStart(2, "0");
  const d = String(day.fullDate.getDate()).padStart(2, "0");
  emit("update:modelValue", `${y}-${m}-${d}`);
  closeCalendar();
}

function clearDate() {
  emit("update:modelValue", "");
  closeCalendar();
}

function selectToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (isDateDisabled(today)) return;
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  emit("update:modelValue", `${y}-${m}-${d}`);
  closeCalendar();
}

function handleEscape(e) {
  if (e.key === "Escape") closeCalendar();
}

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      const date = new Date(val + "T00:00:00");
      if (!isNaN(date.getTime())) {
        currentMonth.value = date.getMonth();
        currentYear.value = date.getFullYear();
      }
    }
  },
);
</script>

<style scoped>
.app-date-picker {
  --dp-brand: #4539cc;
  --dp-brand-light: rgba(69, 57, 204, 0.1);
  --dp-brand-hover: #3a2fb3;
  --dp-text: #111827;
  --dp-text-secondary: #6b7280;
  --dp-text-muted: #9ca3af;
  --dp-border: #d5d1d7;
  --dp-bg: #ffffff;
  --dp-hover: #f3f4f6;
  position: relative;
  width: 100%;
}

/* ==================== INPUT FIELD ==================== */
.dp-input-wrap {
  position: relative;
  cursor: pointer;
}

.dp-input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.125rem;
  height: 1.125rem;
  color: var(--dp-text-secondary);
  pointer-events: none;
}

.dp-input {
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.75rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--dp-text);
  background: var(--dp-bg);
  border: 1px solid var(--dp-border);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);
}

.dp-input::placeholder {
  color: var(--dp-text-muted);
}

.dp-input:hover {
  border-color: #b5b0b8;
}

.dp-input:focus {
  outline: none;
  border-color: transparent;
  box-shadow: 0 0 0 1px var(--dp-brand);
}

.app-date-picker--error .dp-input {
  border-color: #d92d20;
}

.app-date-picker--error .dp-input:focus {
  box-shadow: 0 0 0 1px #d92d20;
}

.app-date-picker--disabled .dp-input {
  background: #f9fafb;
  color: var(--dp-text-muted);
  cursor: not-allowed;
  opacity: 0.6;
}

/* ==================== OVERLAY ==================== */
.dp-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
}

/* ==================== CALENDAR MENU ==================== */
.dp-menu {
  background: var(--dp-bg);
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  width: 320px;
  box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.25);
}

/* ==================== HEADER ==================== */
.dp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.dp-month-year {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--dp-text);
}

.dp-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  color: var(--dp-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.dp-nav-btn:hover {
  background: var(--dp-hover);
  color: var(--dp-text);
}

.dp-nav-btn svg {
  width: 1rem;
  height: 1rem;
}

/* ==================== WEEKDAYS ==================== */
.dp-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.dp-weekday {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--dp-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.025em;
  padding: 0.5rem 0;
}

/* ==================== CALENDAR GRID ==================== */
.dp-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.dp-day {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  min-height: 2.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dp-text);
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dp-day:hover:not(.dp-day--disabled):not(.dp-day--selected) {
  background: var(--dp-hover);
}

.dp-day--other {
  color: var(--dp-text-muted);
  opacity: 0.5;
}

.dp-day--today {
  border: 1.5px solid var(--dp-brand);
  color: var(--dp-brand);
  font-weight: 600;
}

.dp-day--selected {
  background: var(--dp-brand) !important;
  color: #ffffff !important;
  font-weight: 600;
}

.dp-day--selected:hover {
  background: var(--dp-brand-hover) !important;
}

.dp-day--disabled {
  color: #e5e7eb;
  cursor: not-allowed;
  opacity: 0.4;
}

/* ==================== ACTION BUTTONS ==================== */
.dp-actions {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
}

.dp-action-btn {
  flex: 1;
  padding: 0.625rem 1rem;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dp-action-btn--clear {
  background: transparent;
  color: var(--dp-text-secondary);
  border: 1px solid var(--dp-border);
}

.dp-action-btn--clear:hover {
  background: var(--dp-hover);
  border-color: var(--dp-text-secondary);
  color: var(--dp-text);
}

.dp-action-btn--today {
  background: var(--dp-brand);
  color: #ffffff;
}

.dp-action-btn--today:hover {
  background: var(--dp-brand-hover);
}

/* ==================== TRANSITIONS ==================== */
.dp-fade-enter-active,
.dp-fade-leave-active {
  transition: opacity 0.2s ease;
}

.dp-fade-enter-from,
.dp-fade-leave-to {
  opacity: 0;
}

.dp-fade-enter-active .dp-menu,
.dp-fade-leave-active .dp-menu {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.dp-fade-enter-from .dp-menu {
  transform: scale(0.95);
  opacity: 0;
}

.dp-fade-leave-to .dp-menu {
  transform: scale(0.95);
  opacity: 0;
}
</style>
