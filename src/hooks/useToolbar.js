import { useEditorState } from "@tiptap/react";

export function useToolbar(editor) {
  // 🛑 editor not ready yet

  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      strike: editor.isActive("strike"),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      codeBlock: editor.isActive("codeBlock"),
      alignLeft: editor.isActive({ textAlign: "left" }),
      alignCenter: editor.isActive({ textAlign: "center" }),
      alignRight: editor.isActive({ textAlign: "right" }),
    }),
  });

  const actions = {
    bold: () => editor.chain().focus().toggleBold().run(),
    italic: () => editor.chain().focus().toggleItalic().run(),
    underline: () => editor.chain().focus().toggleUnderline().run(),
    strike: () => editor.chain().focus().toggleStrike().run(),
    bullet: () => editor.chain().focus().toggleBulletList().run(),
    ordered: () => editor.chain().focus().toggleOrderedList().run(),
    alignLeft: () => editor.chain().focus().setTextAlign("left").run(),
    alignCenter: () => editor.chain().focus().setTextAlign("center").run(),
    alignRight: () => editor.chain().focus().setTextAlign("right").run(),
    code: () => editor.chain().focus().toggleCodeBlock().run(),
    color: (color) => editor.chain().focus().setColor(color).run(),
    heading: (level) => {
      if (level === "p") {
        editor.chain().focus().setParagraph().run();
      } else {
        editor
          .chain()
          .focus()
          .setHeading({ level: Number(level) })
          .run();
      }
    },
  };

  return { state, actions };
}
