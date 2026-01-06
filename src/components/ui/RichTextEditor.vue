<template>
  <div class="rich-text-editor">
    <!-- Editor Toolbar -->
    <div v-if="editor" class="editor-toolbar">
      <!-- Font Family Dropdown -->
      <div class="toolbar-select-group">
        <Type class="toolbar-select-icon" />
        <select
          v-model="currentFont"
          @change="applyFont"
          class="toolbar-select"
        >
          <option value="Inter">Inter</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
        </select>
      </div>

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
          'editor-toolbar__btn has-tooltip',
          { 'editor-toolbar__btn--active': editor.isActive('bold') },
        ]"
        @click="editor.chain().focus().toggleBold().run()"
        :data-tooltip="`Bold (${isMac ? '⌘' : 'Ctrl'}+B)`"
      >
        <Bold class="editor-toolbar__icon" />
      </button>

      <button
        :class="[
          'editor-toolbar__btn has-tooltip',
          { 'editor-toolbar__btn--active': editor.isActive('italic') },
        ]"
        @click="editor.chain().focus().toggleItalic().run()"
        :data-tooltip="`Italic (${isMac ? '⌘' : 'Ctrl'}+I)`"
      >
        <Italic class="editor-toolbar__icon" />
      </button>

      <button
        :class="[
          'editor-toolbar__btn has-tooltip',
          { 'editor-toolbar__btn--active': editor.isActive('underline') },
        ]"
        @click="editor.chain().focus().toggleUnderline().run()"
        :data-tooltip="`Underline (${isMac ? '⌘' : 'Ctrl'}+U)`"
      >
        <UnderlineIcon class="editor-toolbar__icon" />
      </button>

      <button
        :class="[
          'editor-toolbar__btn has-tooltip',
          { 'editor-toolbar__btn--active': editor.isActive('strike') },
        ]"
        @click="editor.chain().focus().toggleStrike().run()"
        :data-tooltip="`Strikethrough (${isMac ? '⌘' : 'Ctrl'}+Shift+X)`"
      >
        <Strikethrough class="editor-toolbar__icon" />
      </button>

      <div class="editor-toolbar__divider"></div>

      <!-- Text Color -->
      <div class="popover-wrapper">
        <button
          class="editor-toolbar__btn editor-toolbar__btn--color has-tooltip"
          @click="toggleColorPicker"
          data-tooltip="Text Color"
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
          'editor-toolbar__btn has-tooltip',
          {
            'editor-toolbar__btn--active': editor.isActive({
              textAlign: 'left',
            }),
          },
        ]"
        @click="editor.chain().focus().setTextAlign('left').run()"
        :data-tooltip="`Align Left (${isMac ? '⌘' : 'Ctrl'}+Shift+L)`"
      >
        <AlignLeft class="editor-toolbar__icon" />
      </button>

      <button
        :class="[
          'editor-toolbar__btn has-tooltip',
          {
            'editor-toolbar__btn--active': editor.isActive({
              textAlign: 'center',
            }),
          },
        ]"
        @click="editor.chain().focus().setTextAlign('center').run()"
        :data-tooltip="`Align Center (${isMac ? '⌘' : 'Ctrl'}+Shift+E)`"
      >
        <AlignCenter class="editor-toolbar__icon" />
      </button>

      <button
        :class="[
          'editor-toolbar__btn has-tooltip',
          {
            'editor-toolbar__btn--active': editor.isActive({
              textAlign: 'right',
            }),
          },
        ]"
        @click="editor.chain().focus().setTextAlign('right').run()"
        :data-tooltip="`Align Right (${isMac ? '⌘' : 'Ctrl'}+Shift+R)`"
      >
        <AlignRight class="editor-toolbar__icon" />
      </button>

      <button
        :class="[
          'editor-toolbar__btn has-tooltip',
          {
            'editor-toolbar__btn--active': editor.isActive({
              textAlign: 'justify',
            }),
          },
        ]"
        @click="editor.chain().focus().setTextAlign('justify').run()"
        :data-tooltip="`Justify (${isMac ? '⌘' : 'Ctrl'}+Shift+J)`"
      >
        <AlignJustify class="editor-toolbar__icon" />
      </button>

      <div class="editor-toolbar__divider"></div>

      <!-- Lists -->
      <button
        :class="[
          'editor-toolbar__btn has-tooltip',
          { 'editor-toolbar__btn--active': editor.isActive('bulletList') },
        ]"
        @click="editor.chain().focus().toggleBulletList().run()"
        :data-tooltip="`Bullet List (${isMac ? '⌘' : 'Ctrl'}+Shift+8)`"
      >
        <List class="editor-toolbar__icon" />
      </button>

      <button
        :class="[
          'editor-toolbar__btn has-tooltip',
          { 'editor-toolbar__btn--active': editor.isActive('orderedList') },
        ]"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :data-tooltip="`Numbered List (${isMac ? '⌘' : 'Ctrl'}+Shift+7)`"
      >
        <ListOrdered class="editor-toolbar__icon" />
      </button>

      <div class="editor-toolbar__divider"></div>

      <!-- Link -->
      <div class="popover-wrapper" ref="linkButtonRef">
        <button
          :class="[
            'editor-toolbar__btn has-tooltip',
            { 'editor-toolbar__btn--active': editor.isActive('link') },
          ]"
          @click="toggleLinkPopover"
          :data-tooltip="`Insert Link (${isMac ? '⌘' : 'Ctrl'}+K)`"
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
              <AppButton @click="insertLink" variant="primary" size="sm">
                Insert
              </AppButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Image -->
      <div class="popover-wrapper" ref="imageButtonRef">
        <button
          class="editor-toolbar__btn has-tooltip"
          @click="toggleImagePopover"
          data-tooltip="Insert Image"
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
            💡 Drag corners to resize • Delete key to remove
          </div>
          <div class="popover-form">
            <input
              v-model="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="popover-form__input"
              @keyup.enter="insertImageFromUrl"
            />

            <div class="popover-form__divider">
              <span>OR</span>
            </div>

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
              <AppButton
                variant="primary"
                size="sm"
                @click="insertImageFromUrl"
              >
                Insert URL
              </AppButton>
            </div>
          </div>
        </div>
      </div>

      <div class="editor-toolbar__divider"></div>

      <button
        class="editor-toolbar__btn has-tooltip"
        data-tooltip="More Options"
      >
        <Sparkles class="editor-toolbar__icon" />
      </button>
    </div>

    <!-- Editor Content -->
    <EditorContent :editor="editor" class="editor-content" />

    <!-- Image menu and bubble menu code stays the same... -->
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
  Upload,
  Type,
  Sparkles,
} from "lucide-vue-next";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import { Node } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import LinkExtension from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";
import AppButton from "./AppButton.vue";
import { Extension } from "@tiptap/core";

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

const emit = defineEmits(["update:modelValue", "mounted"]);

// State refs
const linkButtonRef = ref(null);
const imageButtonRef = ref(null);
const showColorPicker = ref(false);
const currentColor = ref("#000000");
const showLinkPopover = ref(false);
const linkUrl = ref("");
const showImagePopover = ref(false);
const imageUrl = ref("");
const currentFont = ref("Inter");
const showBubbleMenu = ref(false);
const bubbleMenuStyle = ref({});
const showImageMenu = ref(false);
const imageMenuStyle = ref({});
const currentImageAlign = ref("left");

const isMac = computed(() => {
  return (
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad|iPod/.test(navigator.platform)
  );
});

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

// ==========================================
// SIMPLE LOCKED FIELD - INLINE ATOM NODE
// ==========================================
const LockedField = Node.create({
  name: "lockedField",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      fieldName: { default: "" },
      fieldValue: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span.locked-field-node",
        getAttrs: (dom) => ({
          fieldName: dom.getAttribute("data-field-name") || "",
          fieldValue: dom.getAttribute("data-field-value") || "",
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // Return simple span with text content + lock emoji
    return [
      "span",
      {
        class: "locked-field-node",
        "data-field-name": HTMLAttributes.fieldName,
        "data-field-value": HTMLAttributes.fieldValue,
        contenteditable: "false",
      },
      `${HTMLAttributes.fieldValue} 🔒`,
    ];
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;
        const nodeBefore = $from.nodeBefore;

        if (nodeBefore && nodeBefore.type.name === "lockedField") {
          return true; // Block deletion
        }
        return false;
      },

      Delete: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;
        const nodeAfter = $from.nodeAfter;

        if (nodeAfter && nodeAfter.type.name === "lockedField") {
          return true; // Block deletion
        }
        return false;
      },
    };
  },

  addCommands() {
    return {
      insertLockedField:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
    };
  },
});

// Resizable Image (keeping the same as before, truncated for space)
const ResizableImage = Node.create({
  name: "resizableImage",
  group: "block",
  atom: true,
  draggable: false,
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: null },
      height: { default: null },
      align: { default: "left" },
    };
  },
  parseHTML() {
    return [{ tag: "img[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    const { align, ...attrs } = HTMLAttributes;
    return ["img", { ...attrs, "data-align": align }];
  },
  addCommands() {
    return {
      setImage:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { ...attrs, align: attrs.align || "left" },
          });
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
    Placeholder.configure({ placeholder: props.placeholder }),
    LinkExtension.configure({
      openOnClick: false,
      HTMLAttributes: { class: "editor-link" },
    }),
    ResizableImage,
    LockedField,
  ],
  content: props.modelValue || "",
  editable: props.editable,
  editorProps: {
    attributes: { class: "editor-prose" },
  },
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },
  onCreate: ({ editor: createdEditor }) => {
    emit("mounted", {
      editor: createdEditor,
      insertLockedField: (fieldName, fieldValue) => {
        createdEditor.commands.insertLockedField({ fieldName, fieldValue });
      },
    });
  },
});

// Watch for external content changes
watch(
  () => props.modelValue,
  (newValue) => {
    const currentValue = editor.value?.getHTML();
    if (editor.value && newValue !== currentValue) {
      editor.value.commands.setContent(newValue || "", false);
    }
  }
);

watch(
  () => props.editable,
  (value) => {
    if (editor.value) {
      editor.value.setEditable(value);
    }
  }
);

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

function applyFont() {
  if (editor.value && currentFont.value) {
    editor.value.chain().focus().setFontFamily(currentFont.value).run();
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
  if (!linkUrl.value) return;
  const { from, to } = editor.value.state.selection;
  if (from === to) {
    alert("Please select some text first");
    showLinkPopover.value = false;
    return;
  }
  editor.value.chain().focus().setLink({ href: linkUrl.value }).run();
  showLinkPopover.value = false;
  linkUrl.value = "";
}

function removeLink() {
  editor.value.chain().focus().unsetLink().run();
  showLinkPopover.value = false;
}

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

function handleImageUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("Please select an image file");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert("Image size should be less than 5MB");
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target.result;
    editor.value.chain().focus().setImage({ src: base64 }).run();
    showImagePopover.value = false;
    event.target.value = "";
  };
  reader.readAsDataURL(file);
}

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>

<style scoped lang="scss">
// Keep all existing styles, just add:
:deep(.locked-field-node) {
  // background: linear-gradient(135deg, #fafafa 0%, #d5d7da 100%) !important;
  background-color: #fafafa;
  border: 2px solid #fafafa !important;
  border-radius: 4px !important;
  padding: 2px 8px !important;
  margin: 0 2px !important;
  display: inline !important;
  font-weight: 600 !important;
  color: #000 !important;
  cursor: not-allowed !important;
  user-select: none !important;
  white-space: nowrap !important;
  border-radius: 0.75rem !important;

  &:hover {
    background: #9e77ed !important;
    color: white !important;
    box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3) !important;
  }
}
.rich-text-editor {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: editorFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible;

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

//tooltip
.has-tooltip {
  position: relative;
}

.has-tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: #000000;
  color: #ffffff;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease;
  z-index: 9999;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.35);
}

/* Tooltip arrow */
.has-tooltip {
  position: relative;
}

.has-tooltip {
  &::after {
    content: attr(data-tooltip);
    background: #000000;
    color: #ffffff;
    padding: 6px 8px;
    // smooth animations
  }

  &:hover::after {
    opacity: 1;
    transform: translateX(-50%) translateY(-4px);
  }
}

/* Tooltip arrow */
.editor-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 8px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.editor-btn .tooltip {
  background: #000;
  color: #fff;
  padding: 6px 8px; /* exactly what you want */
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;
}

// show tooltip on hover
.editor-btn:hover .tooltip {
  opacity: 1;
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
  // Font Family Select with Icon
  .toolbar-select-group {
    position: relative;
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 6px; // Changed from 0.5rem to match font size box
    padding-left: 0.5rem; // Reduced padding
    min-width: 10rem;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      border-color: #d1d5db;
      background-color: #fafafa;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    &:focus-within {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      transform: translateY(0);
    }
  }

  .toolbar-select-icon {
    width: 1rem; // Reduced from 1.25rem
    height: 1rem;
    color: #6b7280; // Darker color to match the design
    flex-shrink: 0;
    pointer-events: none;
  }

  .toolbar-select {
    flex: 1;
    padding: 6px 10px; // Match font size padding
    padding-right: 28px;
    background: transparent;
    border: none;
    font-size: 13px;
    color: #374151;
    font-weight: 500;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 16px;

    &:focus {
      outline: none;
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
  border: 1px solid #d5d7da;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
  min-width: 280px;
  max-width: 320px;
  white-space: normal;

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
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e9eaeb;
    font-size: 0.875rem;
    font-weight: 600;
    color: #111827;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: transparent;
    border: none;
    border-radius: 0.375rem;
    font-size: 20px;
    color: #6b7280;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;

    &:hover {
      background: #f3f4f6;
      color: #111827;
    }

    &:active {
      background: #e5e7eb;
    }
  }

  &__colors {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 8px;
    margin-bottom: 0.75rem;
  }

  &__color {
    width: 28px;
    height: 28px;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: border-color 0.15s ease, transform 0.1s ease;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      border-color: #9ca3af;
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.95);
    }

    &--active {
      border: 2px solid #111827;
      box-shadow: 0 0 0 2px #e5e7eb;
    }
  }

  &__color-check {
    pointer-events: none;
  }

  &__custom {
    padding-top: 0.75rem;
    border-top: 1px solid #e9eaeb;
  }

  &__custom-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 0.375rem;
    border-radius: 0.375rem;
    transition: background 0.15s ease;

    &:hover {
      background: #f9fafb;
    }

    span {
      font-size: 0.875rem;
      color: #374151;
      font-weight: 500;
    }
  }

  &__input {
    width: 48px;
    height: 32px;
    border: 1px solid #d5d7da;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: border-color 0.15s ease;

    &:hover {
      border-color: #9ca3af;
    }

    &::-webkit-color-swatch-wrapper {
      padding: 2px;
    }

    &::-webkit-color-swatch {
      border: none;
      border-radius: 0.25rem;
    }
  }
}

// Popover Form (for Link and Image)
.popover-form {
  &__hint {
    padding: 0.75rem;
    background: #fafafa;
    border: 1px solid #e9eaeb;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 1rem;
    line-height: 1.4;
    font-weight: 500;
  }

  &__input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d5d7da;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: #111827;
    transition: border-color 0.15s ease, background 0.15s ease;
    margin-bottom: 0.75rem;
    background: #ffffff;

    &:hover {
      border-color: #9ca3af;
    }

    &:focus {
      outline: none;
      border-color: #111827;
      background: #ffffff;
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  &__divider {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 1rem 0;

    &::before,
    &::after {
      content: "";
      flex: 1;
      height: 1px;
      background: #e9eaeb;
    }

    span {
      font-size: 0.75rem;
      color: #9ca3af;
      font-weight: 500;
    }
  }

  &__upload {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: 1px solid #d5d7da;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease;
    margin-bottom: 0.75rem;
    background: #fafafa;

    &:hover {
      background: #f3f4f6;
      border-color: #9ca3af;

      .popover-form__upload-icon {
        color: #111827;
      }

      span {
        color: #111827;
      }
    }

    &:active {
      background: #e5e7eb;
    }

    span {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
      transition: color 0.15s ease;
    }
  }

  &__upload-icon {
    width: 18px;
    height: 18px;
    color: #6b7280;
    transition: color 0.15s ease;
  }

  &__file-input {
    display: none;
  }

  &__actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }

  &__btn {
    padding: 0.5rem 0.875rem;
    border: 1px solid #d5d7da;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    background: #ffffff;
    color: #374151;

    &--primary {
      background: #111827;
      color: #ffffff;
      border-color: #111827;

      &:hover {
        background: #1f2937;
        border-color: #1f2937;
      }

      &:active {
        background: #374151;
      }
    }

    &--danger {
      background: #ffffff;
      color: #ef4444;
      border-color: #d5d7da;

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
      transform: scale(1.05);
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
        transform: translateY(-2px);
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
// IMAGE MENU - Appears when image is selected
// ========================================

.image-menu {
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
  animation: imageMenuFadeIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 1000;

  @keyframes imageMenuFadeIn {
    from {
      opacity: 0;
      transform: translateY(8px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
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
      transform: scale(1.05);
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
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(69, 57, 204, 0.5);
      }

      .image-menu__icon {
        color: #ffffff;
      }
    }

    &--danger {
      &:hover::before {
        background: rgba(239, 68, 68, 0.2);
      }

      &:hover .image-menu__icon {
        color: #ef4444;
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
// IMAGE RESIZER STYLES (NEW)
// ========================================

:deep(.image-resizer-container) {
  position: relative;
  max-width: 100%;
  display: inline-block;

  margin: 1em 0;
  transition: opacity 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;

  &:hover .resize-handles {
    opacity: 1;
  }

  &.resizing {
    .resize-handles {
      opacity: 1;
    }

    img {
      pointer-events: none;
      opacity: 0.9;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
    }
  }

  // Alignment styles
  &.image-align-left {
    display: block;
    margin-left: 0;
    margin-right: auto;

    img {
      display: block;
    }
  }

  &.image-align-center {
    display: block;
    margin-left: auto;
    margin-right: auto;

    img {
      display: block;
      margin: 0 auto;
    }
  }

  &.image-align-right {
    display: block;
    margin-left: auto;
    margin-right: 0;

    img {
      display: block;
      margin-left: auto;
    }
  }
}

:deep(.resize-handles) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

:deep(.size-indicator) {
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: sizeIndicatorFadeIn 0.2s ease;

  @keyframes sizeIndicatorFadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
}

:deep(.resize-handle) {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #3b82f6;
  border: 2px solid #ffffff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  pointer-events: all;
  transition: all 0.2s ease;
  z-index: 10;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;

  &:hover {
    transform: scale(1.3);
    background: #2563eb;
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: scale(1.4);
    background: #1d4ed8;
  }

  &.resize-handle-nw {
    top: -6px;
    left: -6px;
    cursor: nw-resize;
  }

  &.resize-handle-ne {
    top: -6px;
    right: -6px;
    cursor: ne-resize;
  }

  &.resize-handle-sw {
    bottom: -6px;
    left: -6px;
    cursor: sw-resize;
  }

  &.resize-handle-se {
    bottom: -6px;
    right: -6px;
    cursor: se-resize;
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
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;

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
    user-select: text;
    -webkit-user-select: text;
    -moz-user-select: text;
    cursor: text;
    line-height: 1.75;
    letter-spacing: 0.01em;

    p {
      margin-bottom: 1em;
      user-select: text;
      -webkit-user-select: text;
      -moz-user-select: text;

      &:last-child {
        margin-bottom: 0;
      }
    }

    strong {
      font-weight: 700;
      color: #000000;
      user-select: text;
    }

    em {
      font-style: italic;
      user-select: text;
    }

    u {
      text-decoration: underline;
      user-select: text;
    }

    s {
      text-decoration: line-through;
      user-select: text;
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
      display: block;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      border: 3px solid transparent;
      will-change: transform;

      &:hover {
        border-color: #3b82f6;
        box-shadow: 0 8px 16px rgba(59, 130, 246, 0.15);
        transform: translateY(-2px);
      }

      &.ProseMirror-selectednode {
        border-color: #3b82f6;
        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.25);
        outline: none;
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

    &.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: #fafafa;
      pointer-events: none;
      height: 0;
    }
  }
}

/* Text selection highlight */
:deep(.ProseMirror ::selection) {
  background: #9e77e5;
  color: #ffffff;
}

:deep(.ProseMirror ::-moz-selection) {
  background: #9e77e5;
  color: #ffffff;
}
</style>
