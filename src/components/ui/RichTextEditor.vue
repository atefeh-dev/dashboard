<template>
  <div class="rich-text-editor">
    <!-- Editor Toolbar -->
    <div v-if="editor" class="editor-toolbar">
      <!-- Font Family Dropdown -->
      <select
        class="editor-toolbar__select"
        @change="setFontFamily($event.target.value)"
      >
        <option value="">Font Family</option>
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
        <option value="">Size</option>
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
                '#374151',
                '#6b7280',
                '#ef4444',
                '#f59e0b',
                '#10b981',
                '#3b82f6',
                '#8b5cf6',
                '#ec4899',
                '#ffffff',
              ]"
              :key="color"
              class="popover-dropdown__color"
              :style="{
                backgroundColor: color,
                border: color === '#ffffff' ? '1px solid #e5e7eb' : 'none',
              }"
              @click="setTextColor(color)"
            ></button>
          </div>
          <input
            type="color"
            :value="currentColor"
            @input="setTextColor($event.target.value)"
            class="popover-dropdown__input"
          />
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
          <div class="popover-form">
            <input
              v-model="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="popover-form__input"
              @keyup.enter="insertImage"
            />
            <div class="popover-form__actions">
              <button
                @click="insertImage"
                class="popover-form__btn popover-form__btn--primary"
              >
                Insert
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
      <button class="editor-toolbar__bold-art" @click="$emit('bold-art')">
        Bold art
      </button>
    </div>

    <!-- Editor Content -->
    <EditorContent :editor="editor" class="editor-content" />
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, watch, computed } from "vue";
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

// Check if near right edge (more reliable calculation)
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
    StarterKit.configure({
      link: false,
      underline: false,
    }),
    UnderlineExtension,
    LinkExtension.configure({ openOnClick: false }),
    TextStyle,
    Color,
    FontFamily.configure({ types: ["textStyle"] }),
    FontSize,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    ImageExtension.configure({ inline: true }),
  ],
  content: props.modelValue,
  editable: props.editable,
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },
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

function insertLink() {
  if (linkUrl.value) {
    editor.value
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkUrl.value })
      .run();
    showLinkPopover.value = false;
    linkUrl.value = "";
  }
}

function removeLink() {
  editor.value.chain().focus().unsetLink().run();
  showLinkPopover.value = false;
}

function insertImage() {
  if (imageUrl.value) {
    editor.value.chain().focus().setImage({ src: imageUrl.value }).run();
    showImagePopover.value = false;
    imageUrl.value = "";
  }
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
    transition: all 0.15s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 16px;

    &:hover {
      border-color: #d1d5db;
      background-color: #fafafa;
    }

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }

  &__divider {
    width: 1px;
    height: 20px;
    background: #e5e7eb;
    margin: 0 6px;
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
    transition: all 0.15s ease;
    position: relative;

    &:hover {
      background: #f3f4f6;
    }

    &:active {
      background: #e5e7eb;
    }

    &--active {
      background: #e0e7ff;
      border-color: #c7d2fe;

      .editor-toolbar__icon {
        color: #4f46e5;
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
    background: #111827;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    color: #ffffff;
    font-weight: 600;
    cursor: pointer;
    margin-left: auto;
    transition: all 0.15s ease;
    letter-spacing: -0.01em;

    &:hover {
      background: #1f2937;
    }

    &:active {
      background: #374151;
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
  right: 0;
  z-index: 50;

  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;

  width: 300px;
  max-width: calc(100vw - 16px); // 🔥 prevents overflow
  box-sizing: border-box;

  white-space: normal;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  // Fix overflow: Position from right when near edge

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
    transition: all 0.15s ease;

    &:hover {
      background: #f3f4f6;
      color: #111827;
    }
  }

  &__colors {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    margin-bottom: 12px;
  }

  &__color {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
  }

  &__input {
    width: 100%;
    height: 36px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    cursor: pointer;

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
  &__input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    color: #111827;
    transition: all 0.15s ease;
    margin-bottom: 12px;

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &::placeholder {
      color: #9ca3af;
    }
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
    transition: all 0.15s ease;

    &--primary {
      background: #3b82f6;
      color: #ffffff;

      &:hover {
        background: #2563eb;
      }

      &:active {
        background: #1d4ed8;
      }
    }

    &--danger {
      background: #ffffff;
      color: #ef4444;
      border: 1px solid #e5e7eb;

      &:hover {
        background: #fef2f2;
        border-color: #fecaca;
      }

      &:active {
        background: #fee2e2;
      }
    }
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

  @media (max-width: 768px) {
    padding: 24px;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f9fafb;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;

    &:hover {
      background: #9ca3af;
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

      &:hover {
        color: #2563eb;
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

    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 1em 0;
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
      background: #b3d4fc;
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
