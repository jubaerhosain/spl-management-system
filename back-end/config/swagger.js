import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";

import path from "path";
import fileUtils from "../utils/fileUtils.js";
const mainSpecUrl = path.join(fileUtils.getDirectoryName(import.meta.url), "../api/docs/main.yaml");
const usersSpecUrl = path.join(fileUtils.getDirectoryName(import.meta.url), "../api/docs/users.yaml");
const postsSpecUrl = path.join(fileUtils.getDirectoryName(import.meta.url), "../api/docs/posts.yaml");
const componentsSpecUrl = path.join(fileUtils.getDirectoryName(import.meta.url), "../api/docs/components.yaml");

const mainSpec = YAML.load(mainSpecUrl);
const usersSpec = YAML.load(usersSpecUrl);
const postsSpec = YAML.load(postsSpecUrl);
const componentsSpec = YAML.load(componentsSpecUrl);

const apiSpec = {
  ...mainSpec,
  paths: {
    ...mainSpec.paths,
    ...usersSpec.paths,
    ...postsSpec.paths,
  },
  components: {
    ...mainSpec.components,
    ...componentsSpec.components,
  },
};


export default { swaggerServe: swaggerUI.serve, swaggerSetup: swaggerUI.setup(apiSpec) };

