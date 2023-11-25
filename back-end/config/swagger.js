import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";

import path from "path";
import { getDirectoryName } from "../utils/fileUtils.js";
const mainSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/main.yaml");
const usersSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/users.yaml");
const postsSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/posts.yaml");
const componentsSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/components.yaml");

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
