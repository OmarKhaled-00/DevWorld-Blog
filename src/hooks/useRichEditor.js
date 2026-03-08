import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

import { useState, useEffect } from "react";
import setState from "../utils/setState";
import { getTags } from "../services/tagsApi.services";
import { editorSettings } from "../settings/editor.settings";
export function useRichEditor({
  initialContent = editorSettings.MAXCHARS,
  autoFocus,
  editable,
  onUpdate,
}) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [defaultTags, setDefaultTags] = useState([]);
  const [customTag, setCustomTag] = useState("");
  const [status, setStatus] = useState("public");
  const MAX_CHARS = editorSettings.MAXCHARS;

  useEffect(() => {
    getTags(setDefaultTags);
  }, []);
  useEffect(() => {
    console.log(defaultTags);
  }, [defaultTags]);

  const toggleOption = (option) => {
    setSelectedTags((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleCustomTag = (event) => {
    event.preventDefault();
    setState(setSelectedTags, [...selectedTags, customTag]);
  };

  const handleStatusChange = (event) => {
    event.preventDefault();
    setState(setStatus, event.target.value);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph", "bulletList", "orderedList"],
      }),
    ],
    editable: editable,
    autofocus: autoFocus,
    injectCSS: false,
    content: initialContent,
    onUpdate: onUpdate,
  });
  // Load initial content when editor is ready
  // and when initialContent changes

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent, false);
    }
  }, [editor, initialContent]);

  return {
    editor,
    selectedTags,
    setSelectedTags,
    customTag,
    setCustomTag,
    status,
    setStatus,
    MAX_CHARS,
    toggleOption,
    handleCustomTag,
    handleStatusChange,
    suggestedTags: defaultTags,
  };
}
