import schema from "../../../docs/0.1.0.json";
import homePageData from "../../../schema/index.json";
import aboutPageData from "../../../schema/about.json";
import { useCallback, useState } from "react";

import Preview from "../Preview/Preview";
import { JsonForms } from "@jsonforms/react";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import { createAjv } from "@jsonforms/core";
import ajvErrors from "ajv-errors";

const ISOMER_SCHEMA_URI = "https://schema.isomer.gov.sg/next/0.1.0.json";

export default function Editor() {
  const initialPageData = homePageData; // change this to aboutPageData to see how editing a content page looks like
  const [formData, setFormData] = useState<any>(initialPageData);
  const [schemaData, setSchemaData] = useState<any>(initialPageData);
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const [isJSONValid, setIsJSONValid] = useState(true);
  const ajvInstance = ajvErrors(createAjv());
  const validator = ajvInstance.compile(schema);

  const handleFormDataChange = useCallback(
    (value: any) => {
      console.log(value);
      setFormData(value);

      try {
        if (validator(value)) {
          setIsJSONValid(true);
          setSchemaData(value);
        } else {
          setIsJSONValid(false);
          console.log("JSON is invalid", validator.errors);
        }
      } catch (e) {
        setIsJSONValid(false);
        console.log(e);
      }
    },
    [validator]
  );

  const TopBar = () => (
    <div className="flex flex-row w-full border-b border-b-gray-400 gap-4 px-4 py-1 hover:[&_a]:text-blue-700 hover:[&_button]:text-blue-700">
      <button onClick={() => setIsEditorOpen(!isEditorOpen)}>
        {isEditorOpen ? "Close Editor" : "Open Editor"}
      </button>
      <button onClick={() => handleFormDataChange(initialPageData)}>
        Reset Editor
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
  );

  return (
    <div className="flex flex-col">
      <div className="h-[5vh]">
        <TopBar />
      </div>
      <div className={`h-[95vh] ${isEditorOpen ? "flex flex-row" : ""}`}>
        {isEditorOpen && (
          // mega jank css selectors to prevent the materialRenderers from going full width
          <div className="p-10 overflow-y-auto max-w-[500px] [&_div]:!max-w-full [&_div_.MuiTabs-flexContainer]:overflow-x-auto">
            <JsonForms
              schema={schema}
              data={formData}
              ajv={ajvInstance}
              onChange={({ data, errors }) => {
                console.log(errors);
                handleFormDataChange(data);
              }}
              renderers={materialRenderers}
              cells={materialCells}
            />
          </div>
        )}
        <div className="overflow-y-auto">
          <Preview schema={schemaData} />
        </div>
      </div>
    </div>
  );
}
