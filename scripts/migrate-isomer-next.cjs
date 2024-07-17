const fs = require("fs");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

// Change this to the repo that you wish to migrate
const REPO = "moh-hcsa-next";

// MIGRATION FUNCTIONS
const migrateSchema = (schema) => {
  const migrateContent = (content) => {
    return content.map((item) => {
      if (item.type === "heading") {
        const { type, content, level } = item;
        return {
          type,
          attrs: {
            level,
          },
          content: migrateContent(content),
        };
      } else if (
        item.type === "table" ||
        item.type == "tableCell" ||
        item.type === "tableHeader"
      ) {
        const { type, content, ...attrs } = item;
        return {
          type,
          attrs,
          content: migrateContent(content),
        };
      } else if (item.type === "orderedList" || item.type === "unorderedList") {
        const { type, content, ...attrs } = item;
        const newContent = content.map((listItem) => {
          if (listItem.type === "orderedList") {
            return {
              type: "listItem",
              content: [
                {
                  ...listItem,
                  type: listItem.type,
                  content: migrateContent(listItem.content),
                },
              ],
            };
          } else if (listItem.type === "unorderedList") {
            return {
              type: "listItem",
              content: [
                {
                  type: listItem.type,
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

        if (item.type === "orderedList") {
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
  await exec(`git push origin staging`);

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
