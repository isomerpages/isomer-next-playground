import { IsomerPageSchema, RenderEngine } from "@isomerpages/isomer-components";
import placeholderSchema from "../../data/placeholder.json";

export interface PreviewProps {
  schema?: {
    version: string;
    page: string;
    content: IsomerPageSchema["content"];
  };
}
export default function Preview({ schema }: PreviewProps) {
  const renderSchema = schema || placeholderSchema;

  return (
    <RenderEngine
      site={{
        siteName: "Ministry of Trade and Industry",
        siteMap: [],
        theme: "next",
        language: "en",
        logoUrl: "https://www.isomer.gov.sg/images/isomer-logo.svg",
        isGovernment: true,
        isStaging: false,
      }}
      page={{
        layout: renderSchema.page.layout,
        title: renderSchema.page.title,
      }}
      content={renderSchema.content}
    />
  );
}
