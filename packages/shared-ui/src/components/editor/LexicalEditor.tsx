"use client";

import React, { useCallback, useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  EditorState,
  $getRoot,
  $createParagraphNode,
  $createTextNode,
} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  ListItemNode,
} from "@lexical/list";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";
import styles from "./LexicalEditor.module.css";

// Editor theme configuration
const theme = {
  text: {
    bold: styles.textBold,
    italic: styles.textItalic,
    underline: styles.textUnderline,
  },
  paragraph: styles.paragraph,
  list: {
    nested: {
      listitem: styles.nestedListItem,
    },
    ol: styles.orderedList,
    ul: styles.unorderedList,
    listitem: styles.listItem,
  },
};

// Toolbar component with proper state management
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
    }
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      1
    );
  }, [editor, updateToolbar]);

  const formatText = (format: "bold" | "italic" | "underline") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const insertList = (listType: "ul" | "ol") => {
    if (listType === "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  return (
    <div className={styles.toolbar}>
      <button
        type="button"
        className={`${styles.toolbarButton} ${isBold ? styles.active : ""}`}
        onClick={() => formatText("bold")}
        title="Bold (Ctrl+B)"
        aria-label="Format text as bold"
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        className={`${styles.toolbarButton} ${isItalic ? styles.active : ""}`}
        onClick={() => formatText("italic")}
        title="Italic (Ctrl+I)"
        aria-label="Format text as italic"
      >
        <Italic size={16} />
      </button>
      <button
        type="button"
        className={`${styles.toolbarButton} ${
          isUnderline ? styles.active : ""
        }`}
        onClick={() => formatText("underline")}
        title="Underline (Ctrl+U)"
        aria-label="Format text as underlined"
      >
        <Underline size={16} />
      </button>
      <div className={styles.divider} />
      <button
        type="button"
        className={styles.toolbarButton}
        onClick={() => insertList("ul")}
        title="Bullet List"
        aria-label="Insert bullet list"
      >
        <List size={16} />
      </button>
      <button
        type="button"
        className={styles.toolbarButton}
        onClick={() => insertList("ol")}
        title="Numbered List"
        aria-label="Insert numbered list"
      >
        <ListOrdered size={16} />
      </button>
    </div>
  );
}

// Plugin to handle HTML content and initial state
function HtmlPlugin({
  initialHtml,
  onChange,
}: {
  initialHtml?: string;
  onChange: (html: string) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const [isInitialized, setIsInitialized] = useState(false);

  // Set initial content only once when component mounts
  useEffect(() => {
    if (
      !isInitialized &&
      initialHtml &&
      initialHtml.trim() !== "" &&
      initialHtml !== "<p><br></p>"
    ) {
      editor.update(() => {
        try {
          const parser = new DOMParser();
          const dom = parser.parseFromString(initialHtml, "text/html");
          const nodes = $generateNodesFromDOM(editor, dom);
          const root = $getRoot();
          root.clear();
          root.append(...nodes);
        } catch {
          // Fallback to plain text if HTML parsing fails
          const root = $getRoot();
          root.clear();
          const paragraph = $createParagraphNode();
          const textNode = $createTextNode(initialHtml);
          paragraph.append(textNode);
          root.append(paragraph);
        }
      });
      setIsInitialized(true);
    }
  }, [editor, initialHtml, isInitialized]);

  // Handle editor state changes and convert to HTML
  const handleChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        try {
          const htmlString = $generateHtmlFromNodes(editor, null);
          onChange(htmlString);
        } catch {
          // Fallback - just get text content
          const root = $getRoot();
          const textContent = root.getTextContent();
          onChange(textContent);
        }
      });
    },
    [editor, onChange]
  );

  return <OnChangePlugin onChange={handleChange} />;
}

// Error handler
function onError(error: Error) {
  // In development, log to console; in production, you might want to send to error tracking
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.error("Lexical Editor Error:", error);
  }
}

interface LexicalEditorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function LexicalEditor({
  value = "",
  onChange,
  placeholder = "Enter description...",
  disabled = false,
  className = "",
  "aria-label": ariaLabel = "Rich text editor",
}: LexicalEditorProps) {
  // Editor configuration with explicit settings
  const initialConfig = {
    namespace: "CardDescriptionEditor",
    theme,
    onError,
    editable: !disabled,
    nodes: [ListNode, ListItemNode],
    editorState: null, // Let the editor initialize naturally
  };

  return (
    <div className={`${styles.editorContainer} ${className}`} dir="ltr">
      <LexicalComposer initialConfig={initialConfig}>
        {!disabled && <ToolbarPlugin />}
        <div className={styles.editorInner}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={styles.contentEditable}
                aria-placeholder={placeholder}
                placeholder={
                  <div className={styles.placeholder}>{placeholder}</div>
                }
                aria-label={ariaLabel}
                spellCheck="true"
                dir="ltr"
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HtmlPlugin initialHtml={value} onChange={onChange} />
          <HistoryPlugin />
          <ListPlugin />
        </div>
      </LexicalComposer>
    </div>
  );
}
