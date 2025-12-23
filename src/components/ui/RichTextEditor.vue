<template>
  <div class="rich-text-editor">
    <!-- Editor Toolbar -->
    <div v-if="editor" class="editor-toolbar">
      <!-- Font Family Dropdown -->
      <select
        class="editor-toolbar__select"
        @change="setFontFamily($event.target.value)"
      >
        <option value="Inter">Inter</option>
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value="'Times New Roman'">Times New Roman</option>
        <option value="'Courier New'">Courier New</option>
        <option value="Verdana">Verdana</option>
      </select>

      <!-- Font Size Dropdown -->
      <select
        class="editor-toolbar__select"
        @change="setFontSize($event.target.value)"
      >
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
        <option value="28px">28px</option>
        <option value="32px">32px</option>
      </select>

      <div class="editor-toolbar__divider"></div>

      <!-- Text Formatting -->
      <button
        :class="[
          'editor-toolbar__btn',
          { 'editor-toolbar__btn--active': editor.isActive('bold') },
        ]"
        @click="editor.chain().focus().toggleBold().run()"
        title="Bold (⌘B)"
      >
        <Bold class="editor-toolbar__icon" />
      </button>

      <button
        :class="[
          'editor-toolbar__btn',
          { 'editor-toolbar__btn--active': editor.isActive('italic') },
        ]"
        @click="editor.chain().focus().toggleItalic().run()"
        title="Italic (⌘I)"
      >
        <Italic class="editor-toolbar__icon" />
      </button>

      <button
        :class="[
          'editor-toolbar__btn',
          { 'editor-toolbar__btn--active': editor.isActive('underline') },
        ]"
        @click="editor.chain().focus().toggleUnderline().run()"
        title="Underline (⌘U)"
      >
        <UnderlineIcon class="editor-toolbar__icon" />
      </button>

      <button
        :class="[
          'editor-toolbar__btn',
          { 'editor-toolbar__btn--active': editor.isActive('strike') },
        ]"
        @click="editor.chain().focus().toggleStrike().run()"
        title="Strikethrough"
      >
        <Strikethrough class="editor-toolbar__icon" />
      </button>

      <div class="editor-toolbar__divider"></div>

      <!-- Text Color -->
      <div class="popover-wrapper">
        <button
          class="editor-toolbar__btn editor-toolbar__btn--color"
          @click="toggleColorPicker"
          title="Text Color"
        >
          <Circle
            class="editor-toolbar__icon"
            :style="{ fill: currentColor, color: currentColor }"
          />
        </button>

        <!-- Color Picker Dropdown -->
        <div v-if="showColorPicker" class="popover-dropdown">
          <div class="popover-dropdown__header">
            <span>Text Color</span>
            <button
              @click="showColorPicker = false"
              class="popover-dropdown__close"
            >
              ×
            </button>
          </div>
          <div class="popover-dropdown__colors">
            <button
              v-for="color in [
                '#000000',
                '#1f2937',
                '#374151',
                '#6b7280',
                '#9ca3af',
                '#ef4444',
                '#f97316',
                '#f59e0b',
                '#eab308',
                '#84cc16',
                '#22c55e',
                '#10b981',
                '#14b8a6',
                '#06b6d4',
                '#0ea5e9',
                '#3b82f6',
                '#6366f1',
                '#8b5cf6',
                '#a855f7',
                '#d946ef',
                '#ec4899',
                '#f43f5e',
                '#ffffff',
              ]"
              :key="color"
              :class="[
                'popover-dropdown__color',
                { 'popover-dropdown__color--active': currentColor === color },
              ]"
              :style="{
                backgroundColor: color,
                border: color === '#ffffff' ? '2px solid #e5e7eb' : 'none',
              }"
              @click="setTextColor(color)"
              :title="color"
            >
              <svg
                v-if="currentColor === color"
                class="popover-dropdown__color-check"
                :style="{
                  color:
                    color === '#ffffff' || color === '#9ca3af'
                      ? '#000'
                      : '#fff',
                }"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          </div>
          <div class="popover-dropdown__custom">
            <label class="popover-dropdown__custom-label">
              <span>Custom color</span>
              <input
                type="color"
                :value="currentColor"
                @input="setTextColor($event.target.value)"
                class="popover-dropdown__input"
              />
            </label>
          </div>
        </div>
      </div>

      <div class="editor-toolbar__divider"></div>

      <!-- Alignment -->
      <button
        :class="[
          'editor-toolbar__btn',
          {
            'editor-toolbar__btn--active': editor.isActive({
              textAlign: 'left',
            }),
          },
        ]"
        @click="editor.chain().focus().setTextAlign('left').run()"
        title="Align Left"
      >
        <AlignLeft class="editor-toolbar__icon" />
      </button>

      <button
        :class="[
          'editor-toolbar__btn',
          {
            'editor-toolbar__btn--active': editor.isActive({
              textAlign: 'center',
            }),
          },
        ]"
        @click="editor.chain().focus().setTextAlign('center').run()"
        title="Align Center"
      >
        <AlignCenter class="editor-toolbar__icon" />
      </button>

      <button
        :class="[
          'editor-toolbar__btn',
          {
            'editor-toolbar__btn--active': editor.isActive({
              textAlign: 'right',
            }),
          },
        ]"
        @click="editor.chain().focus().setTextAlign('right').run()"
        title="Align Right"
      >
        <AlignRight class="editor-toolbar__icon" />
      </button>

      <button
        :class="[
          'editor-toolbar__btn',
          {
            'editor-toolbar__btn--active': editor.isActive({
              textAlign: 'justify',
            }),
          },
        ]"
        @click="editor.chain().focus().setTextAlign('justify').run()"
        title="Justify"
      >
        <AlignJustify class="editor-toolbar__icon" />
      </button>

      <div class="editor-toolbar__divider"></div>

      <!-- Lists -->
      <button
        :class="[
          'editor-toolbar__btn',
          { 'editor-toolbar__btn--active': editor.isActive('bulletList') },
        ]"
        @click="editor.chain().focus().toggleBulletList().run()"
        title="Bullet List"
      >
        <List class="editor-toolbar__icon" />
      </button>

      <button
        :class="[
          'editor-toolbar__btn',
          { 'editor-toolbar__btn--active': editor.isActive('orderedList') },
        ]"
        @click="editor.chain().focus().toggleOrderedList().run()"
        title="Numbered List"
      >
        <ListOrdered class="editor-toolbar__icon" />
      </button>

      <div class="editor-toolbar__divider"></div>

      <!-- Link -->
      <div class="popover-wrapper" ref="linkButtonRef">
        <button
          :class="[
            'editor-toolbar__btn',
            { 'editor-toolbar__btn--active': editor.isActive('link') },
          ]"
          @click="toggleLinkPopover"
          title="Insert Link"
        >
          <Link2 class="editor-toolbar__icon" />
        </button>

        <!-- Link Popover -->
        <div
          v-if="showLinkPopover"
          class="popover-dropdown popover-dropdown--wide"
          :class="{ 'popover-dropdown--right': isNearRightEdge }"
        >
          <div class="popover-dropdown__header">
            <span>Insert Link</span>
            <button
              @click="showLinkPopover = false"
              class="popover-dropdown__close"
            >
              ×
            </button>
          </div>
          <div class="popover-form">
            <input
              v-model="linkUrl"
              type="url"
              placeholder="https://example.com"
              class="popover-form__input"
              @keyup.enter="insertLink"
            />
            <div class="popover-form__actions">
              <button
                v-if="editor.isActive('link')"
                @click="removeLink"
                class="popover-form__btn popover-form__btn--danger"
              >
                Remove
              </button>
              <button
                @click="insertLink"
                class="popover-form__btn popover-form__btn--primary"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Image -->
      <div class="popover-wrapper" ref="imageButtonRef">
        <button
          class="editor-toolbar__btn"
          @click="toggleImagePopover"
          title="Insert Image"
        >
          <ImageIcon class="editor-toolbar__icon" />
        </button>

        <!-- Image Popover -->
        <div
          v-if="showImagePopover"
          class="popover-dropdown popover-dropdown--wide"
          :class="{ 'popover-dropdown--right': isNearRightEdge }"
        >
          <div class="popover-dropdown__header">
            <span>Insert Image</span>
            <button
              @click="showImagePopover = false"
              class="popover-dropdown__close"
            >
              ×
            </button>
          </div>
          <div class="popover-form__hint">
            💡 Tip: Click an image and press Delete or Backspace to remove it
          </div>
          <div class="popover-form">
            <!-- URL Input -->
            <input
              v-model="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="popover-form__input"
              @keyup.enter="insertImageFromUrl"
            />

            <!-- OR Divider -->
            <div class="popover-form__divider">
              <span>OR</span>
            </div>

            <!-- File Upload -->
            <label class="popover-form__upload">
              <input
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="popover-form__file-input"
              />
              <Upload class="popover-form__upload-icon" />
              <span>Upload from device</span>
            </label>

            <div class="popover-form__actions">
              <button
                @click="insertImageFromUrl"
                class="popover-form__btn popover-form__btn--primary"
              >
                Insert URL
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="editor-toolbar__divider"></div>

      <!-- More Options (3 dots) -->
      <button class="editor-toolbar__btn" title="More Options">
        <MoreVertical class="editor-toolbar__icon" />
      </button>

      <!-- Bold Art Button -->
      <!-- <button class="editor-toolbar__bold-art" @click="$emit('bold-art')">
        Bold art
      </button> -->
    </div>

    <!-- Editor Content -->
    <EditorContent :editor="editor" class="editor-content" />

    <!-- Bubble Menu (appears on text selection) -->
    <div
      v-if="editor && showBubbleMenu"
      :style="bubbleMenuStyle"
      class="bubble-menu"
    >
      <button
        :class="[
          'bubble-menu__btn',
          { 'bubble-menu__btn--active': editor.isActive('bold') },
        ]"
        @click="editor.chain().focus().toggleBold().run()"
        title="Bold"
      >
        <Bold class="bubble-menu__icon" />
      </button>

      <button
        :class="[
          'bubble-menu__btn',
          { 'bubble-menu__btn--active': editor.isActive('italic') },
        ]"
        @click="editor.chain().focus().toggleItalic().run()"
        title="Italic"
      >
        <Italic class="bubble-menu__icon" />
      </button>

      <button
        :class="[
          'bubble-menu__btn',
          { 'bubble-menu__btn--active': editor.isActive('underline') },
        ]"
        @click="editor.chain().focus().toggleUnderline().run()"
        title="Underline"
      >
        <UnderlineIcon class="bubble-menu__icon" />
      </button>

      <div class="bubble-menu__divider"></div>

      <button
        :class="[
          'bubble-menu__btn',
          {
            'bubble-menu__btn--active': editor.isActive({
              textAlign: 'left',
            }),
          },
        ]"
        @click="editor.chain().focus().setTextAlign('left').run()"
        title="Align Left"
      >
        <AlignLeft class="bubble-menu__icon" />
      </button>

      <button
        :class="[
          'bubble-menu__btn',
          {
            'bubble-menu__btn--active': editor.isActive({
              textAlign: 'center',
            }),
          },
        ]"
        @click="editor.chain().focus().setTextAlign('center').run()"
        title="Align Center"
      >
        <AlignCenter class="bubble-menu__icon" />
      </button>

      <button
        :class="[
          'bubble-menu__btn',
          {
            'bubble-menu__btn--active': editor.isActive({
              textAlign: 'right',
            }),
          },
        ]"
        @click="editor.chain().focus().setTextAlign('right').run()"
        title="Align Right"
      >
        <AlignRight class="bubble-menu__icon" />
      </button>

      <div class="bubble-menu__divider"></div>

      <button
        :class="[
          'bubble-menu__btn',
          { 'bubble-menu__btn--active': editor.isActive('link') },
        ]"
        @click="toggleLinkPopover"
        title="Insert Link"
      >
        <Link2 class="bubble-menu__icon" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, watch, computed, onMounted } from "vue";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Circle,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link2,
  Image as ImageIcon,
  MoreVertical,
  Upload,
} from "lucide-vue-next";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Start typing your document...",
  },
  editable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue", "bold-art"]);

// Refs for positioning
const linkButtonRef = ref(null);
const imageButtonRef = ref(null);

// Popover states
const showColorPicker = ref(false);
const currentColor = ref("#000000");
const showLinkPopover = ref(false);
const linkUrl = ref("");
const showImagePopover = ref(false);
const imageUrl = ref("");

// Bubble menu state
const showBubbleMenu = ref(false);
const bubbleMenuStyle = ref({});

// Check if near right edge
const isNearRightEdge = computed(() => {
  if (typeof window === "undefined") return false;

  if (showLinkPopover.value && linkButtonRef.value) {
    const rect = linkButtonRef.value.getBoundingClientRect();
    const popoverWidth = 300;
    const margin = 20;
    return rect.left + popoverWidth + margin > window.innerWidth;
  }

  if (showImagePopover.value && imageButtonRef.value) {
    const rect = imageButtonRef.value.getBoundingClientRect();
    const popoverWidth = 300;
    const margin = 20;
    return rect.left + popoverWidth + margin > window.innerWidth;
  }

  return false;
});

// Custom FontSize extension
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
    };
  },
});

// Tiptap Editor
const editor = useEditor({
  extensions: [
    StarterKit,
    UnderlineExtension,
    TextStyle,
    Color,
    FontFamily.configure({ types: ["textStyle"] }),
    FontSize,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    LinkExtension.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "editor-link",
      },
    }),
    ImageExtension.configure({
      inline: false, // Changed to block-level for better deletion
      allowBase64: true,
      HTMLAttributes: {
        class: "editor-image",
      },
    }),
  ],
  content: props.modelValue,
  editable: props.editable,
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },
  onSelectionUpdate: ({ editor }) => {
    updateBubbleMenu(editor);
  },
});

// Update bubble menu position - FIXED
function updateBubbleMenu(editorInstance) {
  const { from, to } = editorInstance.state.selection;
  const hasSelection = from !== to;

  if (!hasSelection) {
    showBubbleMenu.value = false;
    return;
  }

  const { view } = editorInstance;
  const start = view.coordsAtPos(from);
  const end = view.coordsAtPos(to);

  // Calculate center position of selection
  const centerX = (start.left + end.left) / 2;
  const topY = start.top - 60; // 60px above selection

  bubbleMenuStyle.value = {
    position: "fixed", // Changed from absolute to fixed
    left: `${centerX}px`,
    top: `${topY}px`,
    transform: "translateX(-50%)",
    zIndex: 1000,
  };

  showBubbleMenu.value = true;
}

// Hide bubble menu on click outside
onMounted(() => {
  const handleClickOutside = (e) => {
    const target = e.target;

    // Close bubble menu
    if (!target.closest(".bubble-menu") && !target.closest(".ProseMirror")) {
      showBubbleMenu.value = false;
    }

    // Close color picker
    if (!target.closest(".popover-wrapper") && showColorPicker.value) {
      const colorButton = target.closest(".editor-toolbar__btn--color");
      if (!colorButton) {
        showColorPicker.value = false;
      }
    }

    // Close link popover
    if (
      showLinkPopover.value &&
      !target.closest(".popover-dropdown") &&
      !target.closest('[title="Insert Link"]')
    ) {
      showLinkPopover.value = false;
    }

    // Close image popover
    if (
      showImagePopover.value &&
      !target.closest(".popover-dropdown") &&
      !target.closest('[title="Insert Image"]')
    ) {
      showImagePopover.value = false;
    }
  };

  document.addEventListener("click", handleClickOutside);

  // Cleanup
  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});

// Watch for external content changes
watch(
  () => props.modelValue,
  (value) => {
    if (editor.value && value !== editor.value.getHTML()) {
      editor.value.commands.setContent(value, false);
    }
  }
);

// Watch editable prop
watch(
  () => props.editable,
  (value) => {
    if (editor.value) {
      editor.value.setEditable(value);
    }
  }
);

// Editor methods
function setFontFamily(font) {
  if (editor.value && font) {
    editor.value.chain().focus().setFontFamily(font).run();
  }
}

function setFontSize(size) {
  if (editor.value && size) {
    editor.value.chain().focus().setFontSize(size).run();
  }
}

function setTextColor(color) {
  if (editor.value && color) {
    editor.value.chain().focus().setColor(color).run();
    currentColor.value = color;
    showColorPicker.value = false;
  }
}

function toggleColorPicker() {
  showColorPicker.value = !showColorPicker.value;
  showLinkPopover.value = false;
  showImagePopover.value = false;
}

function toggleLinkPopover() {
  showLinkPopover.value = !showLinkPopover.value;
  showColorPicker.value = false;
  showImagePopover.value = false;

  if (showLinkPopover.value) {
    const { href } = editor.value.getAttributes("link");
    linkUrl.value = href || "";
  }
}

function toggleImagePopover() {
  showImagePopover.value = !showImagePopover.value;
  showColorPicker.value = false;
  showLinkPopover.value = false;
  imageUrl.value = "";
}

// BEST FIX: Properly exits link without adding space
function insertLink() {
  if (!linkUrl.value) return;

  const { from, to } = editor.value.state.selection;

  if (from === to) {
    alert("Please select some text first");
    showLinkPopover.value = false;
    return;
  }

  // Apply link and move cursor to the end
  editor.value
    .chain()
    .focus()
    .setLink({ href: linkUrl.value })
    .setTextSelection(to)
    .run();

  // Remove link mark from "stored marks" so next character won't be linked
  setTimeout(() => {
    const { state } = editor.value;
    const linkMark = state.schema.marks.link;
    const tr = state.tr.removeStoredMark(linkMark);
    editor.value.view.dispatch(tr);
    editor.value.commands.focus();
  }, 10);

  showLinkPopover.value = false;
  linkUrl.value = "";
}

function removeLink() {
  editor.value.chain().focus().unsetLink().run();
  showLinkPopover.value = false;
}

// Image from URL
function insertImageFromUrl() {
  if (!imageUrl.value) return;

  try {
    new URL(imageUrl.value);
    editor.value.chain().focus().setImage({ src: imageUrl.value }).run();
    showImagePopover.value = false;
    imageUrl.value = "";
  } catch (error) {
    alert("Please enter a valid image URL");
  }
}

// FIXED: Image upload from device
function handleImageUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  // Check if it's an image
  if (!file.type.startsWith("image/")) {
    alert("Please select an image file");
    return;
  }

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("Image size should be less than 5MB");
    return;
  }

  // Convert to base64
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target.result;
    editor.value.chain().focus().setImage({ src: base64 }).run();
    showImagePopover.value = false;

    // Reset file input
    event.target.value = "";
  };
  reader.readAsDataURL(file);
}

// Cleanup
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>

<style scoped lang="scss">
.rich-text-editor {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: editorFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes editorFadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  &:focus-within {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1),
      0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
  }
}

// ========================================
// EDITOR TOOLBAR
// ========================================

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;

  &__select {
    padding: 6px 10px;
    padding-right: 28px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 13px;
    color: #374151;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 16px;

    &:hover {
      border-color: #d1d5db;
      background-color: #fafafa;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      transform: translateY(0);
    }

    &:active {
      transform: scale(0.98);
    }
  }

  &__divider {
    width: 1px;
    height: 20px;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      #e5e7eb 20%,
      #e5e7eb 80%,
      transparent 100%
    );
    margin: 0 6px;
    transition: all 0.3s ease;
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    transform-origin: center;

    &:hover {
      background: #f3f4f6;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    &:active {
      background: #e5e7eb;
      transform: translateY(0);
      box-shadow: none;
    }

    &--active {
      background: #e0e7ff;
      border-color: #c7d2fe;
      box-shadow: 0 2px 4px rgba(79, 70, 229, 0.1);

      .editor-toolbar__icon {
        color: #4f46e5;
      }

      &:hover {
        background: #ddd6fe;
        transform: translateY(-1px);
      }
    }

    &--color {
      .editor-toolbar__icon {
        fill: currentColor;
      }
    }
  }

  &__icon {
    width: 16px;
    height: 16px;
    color: #4b5563;
  }

  &__bold-art {
    padding: 6px 14px;
    background: linear-gradient(135deg, #111827 0%, #000000 100%);
    border: none;
    border-radius: 6px;
    font-size: 13px;
    color: #ffffff;
    font-weight: 600;
    cursor: pointer;
    margin-left: auto;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    letter-spacing: -0.01em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.15),
        rgba(255, 255, 255, 0)
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

      &::before {
        opacity: 1;
      }
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }
}

// ========================================
// POPOVER (Color, Link, Image)
// ========================================

.popover-wrapper {
  position: relative;
}

.popover-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 50;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  min-width: 280px;
  max-width: 320px;
  white-space: normal;
  animation: popoverFadeIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: top left;

  @keyframes popoverFadeIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-8px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  &--wide {
    min-width: 300px;
    width: 300px;
  }

  &--right {
    left: auto;
    right: 0;
    transform: translateX(0);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e5e7eb;
    font-size: 13px;
    font-weight: 600;
    color: #111827;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: transparent;
    border: none;
    border-radius: 4px;
    font-size: 18px;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;

    &:hover {
      background: #f3f4f6;
      color: #111827;
      transform: scale(1.1) rotate(90deg);
    }

    &:active {
      transform: scale(0.95) rotate(90deg);
      background: #e5e7eb;
    }
  }

  &__colors {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 10px;
    margin-bottom: 12px;
  }

  &__color {
    width: 28px;
    height: 28px;
    border-radius: 50%; // Make circles
    border: none;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-origin: center;

    &:hover {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
      z-index: 10;
    }

    &:active {
      transform: scale(1.05) rotate(0deg);
      transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &--active {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
      transform: scale(1.1);

      &:hover {
        transform: scale(1.1) rotate(5deg);
      }
    }
  }

  &__color-check {
    pointer-events: none;
    animation: checkmarkPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    @keyframes checkmarkPop {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
  }

  &__custom {
    padding-top: 12px;
    border-top: 1px solid #e5e7eb;
    animation: customColorSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    @keyframes customColorSlideIn {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  &__custom-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 4px;
    border-radius: 4px;

    &:hover {
      background: #f9fafb;
    }

    span {
      font-size: 13px;
      color: #374151;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    &:hover span {
      color: #111827;
    }
  }

  &__input {
    width: 50px;
    height: 32px;
    border: 2px solid #e5e7eb;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      border-color: #3b82f6;
      transform: scale(1.01);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
    }

    &:active {
      transform: scale(0.98);
    }

    &::-webkit-color-swatch-wrapper {
      padding: 2px;
    }

    &::-webkit-color-swatch {
      border: none;
      border-radius: 4px;
    }
  }
}

// Popover Form (for Link and Image)
.popover-form {
  &__hint {
    padding: 10px 12px;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border-left: 3px solid #3b82f6;
    border-radius: 6px;
    font-size: 12px;
    color: #1e40af;
    margin-bottom: 16px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.5;
    font-weight: 500;
    animation: hintSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);

    @keyframes hintSlideIn {
      from {
        opacity: 0;
        transform: translateX(-8px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  }

  &__input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    color: #111827;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    margin-bottom: 12px;

    &:hover {
      border-color: #d1d5db;
      background: #fafafa;
    }

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      background: #ffffff;
      transform: translateY(-1px);
    }

    &::placeholder {
      color: #9ca3af;
      transition: color 0.2s ease;
    }

    &:focus::placeholder {
      color: #cbd5e1;
    }
  }

  &__divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 16px 0;
    animation: dividerSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    @keyframes dividerSlideIn {
      from {
        opacity: 0;
        transform: scaleX(0.8);
      }
      to {
        opacity: 1;
        transform: scaleX(1);
      }
    }

    &::before,
    &::after {
      content: "";
      flex: 1;
      height: 1px;
      background: linear-gradient(to right, transparent, #e5e7eb, transparent);
    }

    span {
      font-size: 12px;
      color: #6b7280;
      font-weight: 500;
      padding: 0 4px;
    }
  }

  &__upload {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 16px;
    border: 2px dashed #cbd5e1;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-bottom: 12px;
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(59, 130, 246, 0.05) 0%,
        rgba(219, 234, 254, 0.05) 100%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      border-color: #3b82f6;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);

      &::before {
        opacity: 1;
      }

      .popover-form__upload-icon {
        color: #3b82f6;
        transform: scale(1.2) rotate(10deg);
      }

      span {
        color: #1e40af;
      }
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
    }

    span {
      font-size: 13px;
      color: #374151;
      font-weight: 600;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  &__upload-icon {
    width: 20px;
    height: 20px;
    color: #6b7280;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  &__file-input {
    display: none;
  }

  &__actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  &__btn {
    padding: 6px 14px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.2),
        rgba(255, 255, 255, 0)
      );
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    &:hover::before {
      opacity: 1;
    }

    &--primary {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: #ffffff;
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);

      &:hover {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
      }

      &:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
      }
    }

    &--danger {
      background: #ffffff;
      color: #ef4444;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

      &:hover {
        background: #fef2f2;
        border-color: #fecaca;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(239, 68, 68, 0.1);
      }

      &:active {
        background: #fee2e2;
        transform: translateY(0);
      }
    }
  }
}

// ========================================
// BUBBLE MENU - FIXED with Custom Positioning
// ========================================

.bubble-menu {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 10px;
  background: #000000;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3),
    0 4px 6px -2px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  pointer-events: all;
  animation: bubbleMenuFadeIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center bottom;

  @keyframes bubbleMenuFadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(8px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1);
    }
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:hover::before {
      background: rgba(255, 255, 255, 0.1);
      transform: scale(1.01);
    }

    &:active::before {
      background: rgba(255, 255, 255, 0.15);
      transform: scale(0.95);
    }

    &--active {
      background: #4539cc;
      box-shadow: 0 2px 8px rgba(69, 57, 204, 0.4);

      &::before {
        background: transparent;
      }

      &:hover {
        background: #5145d4;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(69, 57, 204, 0.5);
      }

      .bubble-menu__icon {
        color: #ffffff;
      }
    }
  }

  &__icon {
    width: 18px;
    height: 18px;
    color: #ffffff;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 1;
  }

  &__divider {
    width: 1px;
    height: 24px;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(255, 255, 255, 0.15) 20%,
      rgba(255, 255, 255, 0.15) 80%,
      transparent 100%
    );
    margin: 0 6px;
    transition: all 0.3s ease;
  }
}

// ========================================
// EDITOR CONTENT
// ========================================

.editor-content {
  padding: 40px 48px;
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
  background: #ffffff;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 24px;
  }

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #f9fafb;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%);
    border-radius: 5px;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    }

    &:active {
      background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    }
  }

  :deep(.ProseMirror) {
    outline: none;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;
    font-size: 15px;
    line-height: 1.7;
    color: #111827;

    p {
      margin-bottom: 1em;

      &:last-child {
        margin-bottom: 0;
      }
    }

    strong {
      font-weight: 700;
      color: #000000;
    }

    em {
      font-style: italic;
    }

    u {
      text-decoration: underline;
    }

    s {
      text-decoration: line-through;
    }

    a {
      color: #3b82f6;
      text-decoration: underline;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration-thickness: 1px;
      text-underline-offset: 2px;

      &:hover {
        color: #2563eb;
        text-decoration-thickness: 2px;
        text-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
      }
    }

    ul,
    ol {
      padding-left: 1.625em;
      margin-bottom: 1em;
    }

    ul {
      list-style-type: disc;
    }

    ol {
      list-style-type: decimal;
    }

    li {
      margin-bottom: 0.25em;

      p {
        margin-bottom: 0.25em;
      }
    }

    img,
    .editor-image {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 1em 0;
      display: block;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 3px solid transparent;

      &:hover {
        border-color: #3b82f6;
        box-shadow: 0 8px 16px rgba(59, 130, 246, 0.15);
        transform: translateY(-1px);
      }

      &.ProseMirror-selectednode {
        border-color: #3b82f6;
        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.25);
        outline: none;
        position: relative;
        transform: scale(1.01);

        &::after {
          content: "🗑️ Press Delete or Backspace";
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          white-space: nowrap;
          pointer-events: none;
          font-weight: 600;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
          animation: tooltipFadeIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

          @keyframes tooltipFadeIn {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(8px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0) scale(1);
            }
          }
        }

        &::before {
          content: "";
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #1f2937;
          animation: arrowFadeIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s
            backwards;

          @keyframes arrowFadeIn {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(4px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
        }
      }
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-weight: 700;
      color: #000000;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      line-height: 1.3;
    }

    h1 {
      font-size: 2em;
    }

    h2 {
      font-size: 1.5em;
    }

    h3 {
      font-size: 1.25em;
    }

    ::selection {
      background: linear-gradient(135deg, #b3d4fc 0%, #a5c9f5 100%);
      color: #1e293b;
    }

    &.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: #9ca3af;
      pointer-events: none;
      height: 0;
    }
  }
}
</style>
