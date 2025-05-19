import {
  type IsomerComponent,
  RenderEngine,
} from "@opengovsg/isomer-components";
import placeholderSchema from "../../data/placeholder.json";
import navBar from "../../data/navbar.json";
import footer from "../../data/footer.json";
import { forwardRef, PropsWithChildren } from "react";

export interface PreviewProps {
  schema?: {
    version: string;
    layout: string;
    page: any;
    content: IsomerComponent[];
  };
}

// Add a fake link component to prevent the preview from navigating away
const FakeLink = forwardRef<
  HTMLAnchorElement,
  PropsWithChildren<unknown & { href: string }>
>(({ children, href, ...rest }, ref) => {
  if (href.startsWith("#")) {
    return (
      <a {...rest} href={href} ref={ref}>
        {children}
      </a>
    );
  }

  return (
    <a {...rest} href={href} ref={ref} onClick={(e) => e.preventDefault()}>
      {children}
    </a>
  );
});

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
        navbar: navBar,
        // @ts-expect-error blah
        footerItems: footer,
        assetsBaseUrl: `https://isomer-user-content.by.gov.sg`,
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
      LinkComponent={FakeLink}
    />
  );
}
