import {
  type IsomerComponent,
  RenderEngine,
} from "@opengovsg/isomer-components";
import placeholderSchema from "../../data/placeholder.json";
import navBar from "../../data/navbar.json";
import footer from "../../data/footer.json";

export interface PreviewProps {
  schema?: {
    version: string;
    layout: string;
    page: any;
    content: IsomerComponent[];
  };
}
export default function Preview({ schema }: PreviewProps) {
  const renderSchema = schema || placeholderSchema;

  return (
    <RenderEngine
      site={{
        siteName: "Ministry of Trade and Industry",
        // @ts-expect-error blah
        siteMap: { title: "Home", permalink: "/", children: [] },
        theme: "isomer-next",
        logoUrl: "https://www.isomer.gov.sg/images/isomer-logo.svg",
        isGovernment: true,
        environment: "production",
        lastUpdated: "3 Apr 2024",
        navBarItems: navBar,
        // @ts-expect-error blah
        footerItems: footer,
      }}
      // @ts-expect-error blah
      layout={renderSchema.layout}
      page={{
        ...renderSchema.page,
        permalink: "/",
        lastModified: new Date().toISOString(),
      }}
      // @ts-expect-error blah
      content={renderSchema.content}
    />
  );
}
