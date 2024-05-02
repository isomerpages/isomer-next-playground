import { Bold } from "@tiptap/extension-bold";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Document } from "@tiptap/extension-document";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { Heading } from "@tiptap/extension-heading";
import { History } from "@tiptap/extension-history";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { Italic } from "@tiptap/extension-italic";
import { ListItem } from "@tiptap/extension-list-item";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Strike } from "@tiptap/extension-strike";
import { Text } from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import type { CustomRendererProps } from "./types";

const ProseBlockEditor = ({
  data,
  handleChange,
  path,
}: CustomRendererProps) => {
  const editor = useEditor({
    extensions: [
      // Blockquote,
      Bold,
      BulletList.extend({
        name: "unorderedlist",
      }),
      // Code,
      // CodeBlock,
      Document,
      Dropcursor,
      Gapcursor,
      // HardBreak,
      Heading,
      History,
      HorizontalRule.extend({
        name: "divider",
      }),
      Italic,
      ListItem,
      OrderedList.extend({
        name: "orderedlist",
      }),
      Paragraph,
      Strike,
      Text,
    ],
    content: data,
    onUpdate({ editor }) {
      handleChange(path, editor.getJSON().content);
    },
  });

  return (
    <div className="p-2">
      <EditorContent editor={editor} className="p-2" />
    </div>
  );
};

export default ProseBlockEditor;
