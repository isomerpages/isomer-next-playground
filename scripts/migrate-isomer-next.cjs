const fs = require("fs");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { argv } = require("node:process");

// Change this to the repo that you wish to migrate
const REPO = (argv.length > 2 && argv[2]) || "moh-hcsa-next";

// MIGRATION FUNCTIONS
const migrateSchema = (schema) => {
  const migrateContent = (content) => {
    try {
      return content.map((item) => {
        if (item.type === "hero") {
          // Remove alignment from props
          const { alignment: _, ...rest } = item;
          return rest;
        } else if (item.type === "callout") {
          // Remove variant from props
          const { variant: _, ...rest } = item;
          return rest;
        } else if (item.type === "infocards") {
          // Remove variant and sectionIdx from props
          const { variant: _, sectionIdx: __, ...rest } = item;
          return rest;
        } else if (item.type === "infocols") {
          // Remove backgroundColor, buttonLabel and buttonUrl from props
          const {
            backgroundColor: _,
            buttonLabel: __,
            buttonUrl: ___,
            sectionIdx: ____,
            ...rest
          } = item;
          return rest;
        } else if (item.type === "infobar") {
          // Remove sectionIdx and subtitle from props
          const { sectionIdx: _, subtitle: __, ...rest } = item;
          return rest;
        } else if (item.type === "infopic") {
          // Remove sectionIndex, isTextOnRight, variant and subtitle from props
          const {
            sectionIndex: _,
            isTextOnRight: __,
            variant: ___,
            subtitle: ____,
            ...rest
          } = item;
          return rest;
        } else if (item.type === "keystatistics") {
          // Remove variant from props
          const { variant: _, ...rest } = item;
          return rest;
        } else if (item.type === "text") {
          // Move href into a new attrs object, if the marks array contains a link mark
          const { marks, ...rest } = item;
          if (marks && marks.length > 0) {
            const linkMark = marks.find((mark) => mark.type === "link");
            const restMarks = marks.filter((mark) => mark.type !== "link");
            const newMarks = restMarks.length > 0 ? [...restMarks] : [];

            if (linkMark) {
              newMarks.push({
                type: "link",
                attrs: {
                  href: linkMark.href || linkMark.attrs.href,
                },
              });
            }

            return {
              ...rest,
              marks: newMarks,
            };
          }

          return item;
        } else if (item.type === "iframe") {
          return item;
        } else if (item.type === "accordion") {
          const { details, ...rest } = item;
          const { content, ...detailsRest } = details;

          if (content) {
            return {
              ...rest,
              details: {
                ...detailsRest,
                content: migrateContent(content),
              },
            };
          }

          return item;
        } else if (
          item.type === "orderedList" ||
          item.type === "unorderedList"
        ) {
          // Check for every list item in the list, check if the item has content with only one item which is of type paragraph
          // and check if the next item in the list is another list item with item of type either orderedList or unorderedList
          // If both conditions are true, combine both list items into a single list item
          const newContent = [];
          let i = 0;
          while (i < item.content.length) {
            const currentItem = item.content[i];
            const nextItem = item.content[i + 1];

            if (
              currentItem.type === "listItem" &&
              currentItem.content.length === 1 &&
              currentItem.content[0].type === "paragraph" &&
              nextItem &&
              nextItem.type === "listItem" &&
              nextItem.content.length === 1 &&
              (nextItem.content[0].type === "orderedList" ||
                nextItem.content[0].type === "unorderedList")
            ) {
              newContent.push({
                type: "listItem",
                content: [...currentItem.content, ...nextItem.content],
              });
              i += 2;
            } else {
              newContent.push(currentItem);
              i += 1;
            }
          }

          return {
            ...item,
            content: newContent.map((listItem) => {
              if (listItem.type === "listItem") {
                return {
                  ...listItem,
                  content: migrateContent(listItem.content),
                };
              }

              return listItem;
            }),
          };
        } else {
          const { content, ...rest } = item;
          if (content) {
            return {
              ...rest,
              content: migrateContent(content),
            };
          }

          return item;
        }
      });
    } catch (e) {
      console.log(content);
      throw e;
    }
  };

  const migratedContent = migrateContent(schema.content);
  return {
    ...schema,
    content: migratedContent,
  };
};

const migrateSchemaV1 = (schema) => {
  const migrateContent = (content) => {
    return content.map((item) => {
      if (item.type === "heading" || item.type === "table") {
        if (item.attrs) {
          const { type, content, attrs } = item;
          return {
            type,
            attrs,
            content: migrateContent(content),
          };
        }

        const { type, content, level } = item;
        return {
          type,
          attrs: {
            level,
          },
          content: migrateContent(content),
        };
      } else if (item.type === "tableCell" || item.type === "tableHeader") {
        if (item.attrs) {
          const { type, content, attrs } = item;
          return {
            type,
            attrs,
            content: migrateContent(content),
          };
        }

        const { type, content, colSpan, rowSpan, ...attrs } = item;
        const newAttrs = {};
        if (colSpan) {
          newAttrs.colspan = colSpan;
        }

        if (rowSpan) {
          newAttrs.rowspan = rowSpan;
        }

        if (Object.keys(attrs).length + Object.keys(newAttrs).length === 0) {
          return {
            type,
            content: migrateContent(content),
          };
        }

        return {
          type,
          attrs: {
            ...attrs,
            ...newAttrs,
          },
          content: migrateContent(content),
        };
      } else if (
        item.type.toLowerCase() === "orderedlist" ||
        item.type.toLowerCase() === "unorderedlist"
      ) {
        if (item.attrs) {
          const { content, attrs } = item;
          const newType =
            item.type.toLowerCase() === "orderedlist"
              ? "orderedList"
              : "unorderedList";
          return {
            type: newType,
            attrs,
            content: migrateContent(content),
          };
        }

        const { content, ...attrs } = item;
        const newContent = content.map((listItem) => {
          if (listItem.type.toLowerCase() === "orderedlist") {
            return {
              type: "listItem",
              content: [
                {
                  ...listItem,
                  type: "orderedList",
                  content: migrateContent(listItem.content),
                },
              ],
            };
          } else if (listItem.type.toLowerCase() === "unorderedlist") {
            return {
              type: "listItem",
              content: [
                {
                  type: "unorderedList",
                  content: migrateContent(listItem.content),
                },
              ],
            };
          } else {
            return {
              ...listItem,
              type: listItem.type,
              content: migrateContent(listItem.content),
            };
          }
        });

        if (item.type.toLowerCase() === "orderedlist") {
          return {
            type: "orderedList",
            attrs,
            content: newContent,
          };
        } else {
          return {
            type: "unorderedList",
            content: newContent,
          };
        }
      } else if (
        item.type === "tableRow" ||
        item.type === "listItem" ||
        item.type === "prose"
      ) {
        return {
          type: item.type,
          content: migrateContent(item.content),
        };
      } else {
        return item;
      }
    });
  };

  const migratedContent = migrateContent(schema.content);
  const newContent = [];
  const prose = {
    type: "prose",
    content: [],
  };

  migratedContent.forEach((item) => {
    if (
      item.type === "heading" ||
      item.type === "divider" ||
      item.type === "paragraph" ||
      item.type === "table" ||
      item.type === "orderedList" ||
      item.type === "unorderedList"
    ) {
      prose.content.push(item);
    } else {
      if (prose.content.length > 0) {
        newContent.push({ ...prose });
        prose.content = [];
      }
      newContent.push(item);
    }
  });

  if (prose.content.length > 0) {
    newContent.push({ ...prose });
  }

  return {
    ...schema,
    content: newContent,
  };
};

const migrate = async (repo, file) => {
  const fileData = await fs.promises.readFile(file, "utf8");
  const schema = JSON.parse(fileData);
  const migratedSchema = migrateSchema(schema);
  await fs.promises.writeFile(
    file,
    JSON.stringify(migratedSchema, null, 2) + "\n"
  );
};

// DO NOT TOUCH
const performMigration = async (repo) => {
  console.log(`Migrating ${repo}...`);

  const getFiles = async (dir) => {
    const subdirs = await fs.promises.readdir(dir);
    const files = await Promise.all(
      subdirs.map(async (subdir) => {
        const res = path.resolve(dir, subdir);
        return (await fs.promises.stat(res)).isDirectory()
          ? getFiles(res)
          : res;
      })
    );
    return files.reduce((a, f) => a.concat(f), []);
  };

  const files = await getFiles("schema");

  Promise.all(
    files.map(async (file) => {
      const fileName = file.split("/").pop();
      if (fileName === "_pages.json") {
        return;
      }

      await migrate(repo, file);
    })
  );
};

const cloneRepo = async (repo) => {
  console.log(`Cloning ${repo}...`);
  await exec(`git clone git@github.com:isomerpages/${repo}.git`);
};

const pushAndDelete = async (repo) => {
  console.log(`Pushing changes to ${repo}...`);
  await exec(`git add .`);
  await exec(`git commit -m "chore: performing migration on schema files"`);
  await exec(`git push origin`);

  process.chdir("..");
  await fs.promises.rm(repo, { recursive: true });
};

const main = async () => {
  const TEMP_DIR = "./temp-next-migration";

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
  }

  process.chdir(TEMP_DIR);

  await cloneRepo(REPO);
  process.chdir(REPO);
  await performMigration(REPO);
  await pushAndDelete(REPO);
};

main();
