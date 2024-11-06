"use client";

import "@mdxeditor/editor/style.css";
import React, { useEffect, useRef, useState } from "react";
import {
  MDXEditor,
  MDXEditorMethods,
  codeBlockPlugin,
  codeMirrorPlugin,
  frontmatterPlugin,
  headingsPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  InsertTable,
  InsertCodeBlock,
} from "@mdxeditor/editor";

export interface MdxEditorProps {
  content: string;
  // eslint-disable-next-line no-unused-vars
  setContentInParent: (content: string) => void;
  // eslint-disable-next-line no-unused-vars
  setEditorErrorInParent?: (error: { error: string; source: string }) => void;
}

export const MdxEditor: React.FC<MdxEditorProps> = ({ content, setContentInParent, setEditorErrorInParent }) => {
  const ref = useRef<MDXEditorMethods>(null);
  const [markdownContent, setMarkdownContent] = useState<string>(content);

  useEffect(() => {
    setMarkdownContent(content);
  }, [content]);

  useEffect(() => {
    setContentInParent(markdownContent);
  }, [markdownContent, setContentInParent]);

  const handleDivClick = () => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  return (
    <div className="h-full overflow-y-auto w-full cursor-text bg-slate-800" onClick={handleDivClick}>
      <MDXEditor
        ref={ref}
        className="dark-theme dark-editor w-full h-48 border rounded-md p-2 overflow-auto resize-none"
        onChange={(markdownContent) => {
          setMarkdownContent(markdownContent);
        }}
        markdown={markdownContent}
        contentEditableClassName="prose dark:prose-invert"
        suppressHtmlProcessing={true}
        onError={(error) => {
          console.error("MDXEditor error:", error);
          if (setEditorErrorInParent) {
            setEditorErrorInParent({ error: error.error, source: "MDXEditor" });
          }
        }}
        plugins={[
          toolbarPlugin({
            toolbarClassName: "my-toolbar",
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <InsertTable />
                <InsertCodeBlock />
              </>
            ),
          }),
          listsPlugin(),
          quotePlugin(),
          headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
          linkPlugin(),
          tablePlugin(),
          thematicBreakPlugin(),
          frontmatterPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: "JavaScript",
              css: "CSS",
              txt: "text",
              tsx: "TypeScript",
            },
          }),
          markdownShortcutPlugin(),
        ]}
      />
    </div>
  );
};
