import CodeEditor from "@monaco-editor/react";
import { useEffect, useState } from "react";

import placeholder from "../../data/placeholder.json";
import Preview from "../Preview/Preview";
import Ajv from "ajv";

const ISOMER_SCHEMA_URI = "https://schema.isomer.gov.sg/next/0.1.0.json";

export default function Editor() {
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const [editedSchema, setEditedSchema] = useState<any>(placeholder);
  const [isJSONValid, setIsJSONValid] = useState(true);

  const [validate, setValidate] = useState<any>(null);

  const loadSchema = async () => {
    await fetch(ISOMER_SCHEMA_URI)
      .then((response) => response.json())
      .then((schema) => {
        const ajv = new Ajv();
        const validateFn = ajv.compile(schema);
        setValidate(() => validateFn);
      });
  };

  useEffect(() => {
    if (validate === null) {
      loadSchema();
    }
  });

  const handleEditorChange = (value: any) => {
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
      <div className="flex flex-row w-full border-b border-b-gray-400 gap-4 px-4 py-1 hover:*:text-blue-700">
        <button onClick={() => setIsEditorOpen(!isEditorOpen)}>
          {isEditorOpen ? "Close Editor" : "Open Editor"}
        </button>
        <a href={ISOMER_SCHEMA_URI} target="_blank">
          Isomer Schema
        </a>
        <a
          href="https://rjsf-team.github.io/react-jsonschema-form/"
          target="_blank"
        >
          Form-based editor
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
            defaultValue={JSON.stringify(placeholder, null, 2)}
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
