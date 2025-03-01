import CodeEditor from "@monaco-editor/react";
import { useEffect, useState } from "react";

import placeholder from "../../data/placeholder.json";
import Preview from "../Preview/Preview";
import Ajv from "ajv";

const ISOMER_SCHEMA_URI = "/0.1.0.json";

export default function Editor() {
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const [editorValue, setEditorValue] = useState(
    JSON.stringify(placeholder, null, 2)
  );
  const [editedSchema, setEditedSchema] = useState<any>(placeholder);
  const [isJSONValid, setIsJSONValid] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const [validate, setValidate] = useState<any>(null);

  const loadSchema = async () => {
    await fetch(ISOMER_SCHEMA_URI)
      .then((response) => response.json())
      .then((schema) => {
        const ajv = new Ajv({ strict: false });
        const validateFn = ajv.compile(schema);
        setValidate(() => validateFn);
      });
  };

  useEffect(() => {
    if (validate === null) {
      loadSchema();
    }

    const saved = localStorage.getItem("editorValue");

    if (saved) {
      handleEditorChange(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validate]);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => setIsCopied(false), 3000);
    }
  }, [isCopied]);

  const handleEditorChange = (value: any) => {
    setEditorValue(value);
    localStorage.setItem("editorValue", value);

    try {
      const parsedJson = JSON.parse(value);

      if (validate === null) {
        console.log("Schema not loaded yet");
        return;
      }

      if (validate(parsedJson)) {
        setIsJSONValid(true);
        setEditedSchema(parsedJson);
      } else {
        setIsJSONValid(false);
        console.log("JSON is invalid", validate.errors);
      }
    } catch (e) {
      setIsJSONValid(false);
      console.log(e);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row w-full border-b border-b-gray-400 gap-4 px-4 py-1 hover:[&_a]:text-blue-700 hover:[&_button]:text-blue-700">
        <button onClick={() => setIsEditorOpen(!isEditorOpen)}>
          {isEditorOpen ? "Close Editor" : "Open Editor"}
        </button>
        <button
          onClick={() =>
            handleEditorChange(JSON.stringify(placeholder, null, 2))
          }
        >
          Reset Editor
        </button>
        <a href={ISOMER_SCHEMA_URI} target="_blank">
          Isomer Schema
        </a>
        <a
          href="https://github.com/isomerpages/isomer-next-playground/blob/main/components.md"
          target="_blank"
        >
          Sample JSON Blocks
        </a>

        <div className="flex-1"></div>

        <div
          className={`px-2 ${
            isJSONValid
              ? "text-green-700 bg-green-200"
              : "text-red-700 bg-red-200"
          }`}
        >
          {isJSONValid ? "Valid" : "Invalid"}
        </div>
      </div>

      <div className="flex flex-row">
        <div
          className={
            isEditorOpen
              ? "w-2/5 h-[calc(100vh-33px)] border-r-2 border-r-gray-400"
              : "w-0"
          }
        >
          <CodeEditor
            height="100%"
            defaultLanguage="json"
            value={editorValue}
            onChange={handleEditorChange}
          />
        </div>
        <div
          className={`h-[calc(100vh-33px)] overflow-scroll ${
            isEditorOpen ? "w-3/5 px-1" : "w-full"
          }`}
        >
          <Preview schema={editedSchema} />
        </div>
      </div>
    </div>
  );
}
