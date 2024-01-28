import { RenderEngine } from "@isomerpages/isomer-components";
import schema from "./schema";
function App() {
  return (
    <RenderEngine
      id={schema.id}
      layout={schema.layout}
      path={schema.permalink}
      components={schema.components}
    />
  );
}

export default App;
