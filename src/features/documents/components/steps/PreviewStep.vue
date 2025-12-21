<template>
  <StepLayoutWithSidebar
    :document-title="documentInfo.title"
    :last-edit="documentInfo.lastEdit"
    :status="documentInfo.status"
    :status-variant="documentInfo.statusVariant"
    :author-name="documentInfo.authorName"
    :author-avatar="documentInfo.authorAvatar"
    :template-name="documentInfo.templateName"
    :template-author="documentInfo.templateAuthor"
    :template-update-date="documentInfo.templateUpdateDate"
    :template-tags="documentInfo.templateTags"
    :checklist-items="documentInfo.checklistItems"
  >
    <div class="preview-step">
      <section class="section">
        <h2 class="section__heading">
          Preview your generated document content
        </h2>
        <p class="section__description">
          You can see your answers in action with template and generated
          content.
        </p>

        <!-- Export Tabs -->
        <div class="export-tabs">
          <button
            v-for="tab in exportTabs"
            :key="tab.value"
            :class="[
              'export-tabs__tab',
              { 'export-tabs__tab--active': selectedExport === tab.value },
            ]"
            @click="selectedExport = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Warning Message -->
        <div class="warning-banner">
          <AlertCircle class="warning-banner__icon" />
          <p class="warning-banner__text">
            You can edit and style the generated content but you can't save your
            new changed content
          </p>
        </div>

        <!-- Rich Text Editor -->
        <div class="editor-container">
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
                      border:
                        color === '#ffffff' ? '1px solid #e5e7eb' : 'none',
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
                {
                  'editor-toolbar__btn--active': editor.isActive('bulletList'),
                },
              ]"
              @click="editor.chain().focus().toggleBulletList().run()"
              title="Bullet List"
            >
              <List class="editor-toolbar__icon" />
            </button>

            <button
              :class="[
                'editor-toolbar__btn',
                {
                  'editor-toolbar__btn--active': editor.isActive('orderedList'),
                },
              ]"
              @click="editor.chain().focus().toggleOrderedList().run()"
              title="Numbered List"
            >
              <ListOrdered class="editor-toolbar__icon" />
            </button>

            <div class="editor-toolbar__divider"></div>

            <!-- Link -->
            <div class="popover-wrapper">
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
            <div class="popover-wrapper">
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

            <!-- More Options / AI -->
            <button class="editor-toolbar__btn" title="AI Features">
              <MoreHorizontal class="editor-toolbar__icon" />
            </button>

            <!-- Bold Art Button (moved to end) -->
            <button class="editor-toolbar__bold-art">Bold art</button>
          </div>

          <!-- Editor Content -->
          <EditorContent :editor="editor" class="editor-content" />
        </div>

        <!-- Navigation Buttons -->
        <div class="form-actions">
          <AppButton variant="ghost" size="md" @click="$emit('back')">
            <ChevronLeft class="form-actions__icon" />
            Back
          </AppButton>
          <AppButton variant="primary" size="md" @click="$emit('continue')">
            Continue
            <ChevronRight class="form-actions__icon" />
          </AppButton>
        </div>
      </section>
    </div>
  </StepLayoutWithSidebar>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
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
  MoreHorizontal,
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
import StepLayoutWithSidebar from "../../layout/StepLayoutWithSidebar.vue";
import AppButton from "@/components/ui/AppButton.vue";

const props = defineProps({
  documentInfo: {
    type: Object,
    required: true,
  },
  stepData: {
    type: Object,
    required: true,
  },
  initialContent: {
    type: String,
    default: `<p>No aspect of nature on this beach is more mysterious to me than the flights of these shore-bird constellations. The constellation forms, as I have hinted, in an instant of time, and in that same instant develops its own will.</p>

<p>Birds which have been feeding yards away from each other, each one individually busy for his individual body's sake, suddenly rise into the new volition as one, coast as one, till as one, and as one wheel off on the course the new group will has determined.</p>

<p>There is no such thing, I may say, as a lead bird or guide. Had I more space I should like nothing better than to discuss this new will and its instant of origin, but I do not want to crowd this part of my chapter, and must therefore leave the problem to all who study the psychic relations of the individual to the herd, the herd to the surrounding many.</p>

<p>My special interest is rather the instant and synchronous obedience of each speeding body to the new volition. By what means, by what methods of communication does this will so suffuse the living constellation that its dozen or more tiny brains know it and obey it in such an instancy of time?</p>

<p>Are we to believe that these birds, all of them, are machina, as Descartes long ago insisted, mere mechanisms of flesh and bone so exquisitely alike that each cogwheel brain, encountering the same environmental forces, synchronously lets slip the same mechanic ratchet? or is there some psychic relation between these creatures? Does some current flow through them and between them as they fly?</p>

<p>Schools of fish, I am told, make similar mass changes of direction. I saw such a thing once, but of that more anon.</p>

<p>The afternoon sun sinks red as fire, the tide climbs the beach, its foam a strange crimson; miles out, a freighter goes north, emerging from the shoals.</p>

<p>We need another and a wiser and perhaps a more mystical concept of animals. Remote from universal nature, and living by complicated artifice, man in civilization surveys the creature through the glass of his knowledge and sees thereby a feather magnified and the whole image in distortion.</p>`,
  },
});

const emit = defineEmits(["continue", "back", "update:data"]);

// Export tabs
const selectedExport = ref("export1");
const exportTabs = [
  { value: "export1", label: "Export 1" },
  { value: "export2", label: "Export 2" },
];

// Color picker
const showColorPicker = ref(false);
const currentColor = ref("#000000");

// Link popover
const showLinkPopover = ref(false);
const linkUrl = ref("");
const linkText = ref("");

// Image popover
const showImagePopover = ref(false);
const imageUrl = ref("");

// Custom FontSize extension for Tiptap (defined before editor)
const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
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
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
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
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
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
    FontFamily.configure({
      types: ["textStyle"],
    }),
    FontSize,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    LinkExtension.configure({
      openOnClick: false,
    }),
    ImageExtension.configure({
      inline: true,
    }),
  ],
  content: props.initialContent,
  editorProps: {
    attributes: {
      class:
        "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none",
    },
  },
  onUpdate: ({ editor }) => {
    emit("update:data", {
      content: editor.getHTML(),
    });
  },
});

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
    // Pre-fill with current link if exists
    const { href } = editor.value.getAttributes("link");
    linkUrl.value = href || "";
    // Get selected text
    const { from, to } = editor.value.state.selection;
    linkText.value = editor.value.state.doc.textBetween(from, to, " ");
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
    linkText.value = "";
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
@use "./stepStyles.scss";

// .preview-step {
//   // Step-specific styles
// }

// ========================================
// EXPORT TABS
// ========================================

.export-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;

  &__tab {
    padding: 8px 20px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    &:active {
      background: #f3f4f6;
    }

    &--active {
      background: #eff6ff;
      border-color: #3b82f6;
      color: #3b82f6;
      font-weight: 600;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.08);
    }
  }
}

// ========================================
// WARNING BANNER
// ========================================

.warning-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  margin-bottom: 20px;

  &__icon {
    width: 20px;
    height: 20px;
    color: #f59e0b;
    flex-shrink: 0;
    margin-top: 1px;
  }

  &__text {
    font-size: 14px;
    color: #92400e;
    line-height: 1.5;
    font-weight: 500;
  }
}

// ========================================
// EDITOR CONTAINER
// ========================================

.editor-container {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: visible;
  margin-bottom: 32px;
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
  left: 0;
  z-index: 50;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  min-width: 200px;

  &--wide {
    min-width: 300px;
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
  min-height: 500px;
  max-height: 700px;
  overflow-y: auto;
  background: #ffffff;

  @media (max-width: 768px) {
    padding: 24px;
  }

  // Custom scrollbar
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

  // Prose styling for content
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

    // Text alignment
    .has-text-align-left {
      text-align: left;
    }

    .has-text-align-center {
      text-align: center;
    }

    .has-text-align-right {
      text-align: right;
    }

    .has-text-align-justify {
      text-align: justify;
    }

    // Selection styling
    ::selection {
      background: #b3d4fc;
    }

    // Placeholder
    &.is-editor-empty:first-child::before {
      content: "Start typing your document...";
      float: left;
      color: #9ca3af;
      pointer-events: none;
      height: 0;
    }
  }
}
</style>
