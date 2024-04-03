import { IsomerPageSchema, RenderEngine } from "@isomerpages/isomer-components";
import placeholderSchema from "../../data/placeholder.json";
import navBar from "../../data/navbar.json";
import footer from "../../data/footer.json";

export interface PreviewProps {
  schema?: {
    version: string;
    layout: string;
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
        theme: "isomer-next",
        logoUrl: "https://www.isomer.gov.sg/images/isomer-logo.svg",
        isGovernment: true,
        environment: "production",
        navBarItems: navBar,
        // @ts-expect-error blah
        footerItems: footer,
      }}
      // @ts-expect-error blah
      layout={renderSchema.layout}
      page={{
        // @ts-expect-error blah
        title: renderSchema.page.title,
      }}
      // @ts-expect-error blah
      content={renderSchema.content}
    />
  );
}
