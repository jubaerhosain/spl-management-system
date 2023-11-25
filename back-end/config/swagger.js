import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";

import path from "path";
import { getDirectoryName } from "../utils/fileUtils.js";
const mainSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/main.yaml");
const componentsSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/components.yaml");
const authSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/paths/auth.yaml");
const usersSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/paths/users.yaml");
const studentsSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/paths/students.yaml");
const teachersSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/paths/teachers.yaml");
const splsSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/paths/spls.yaml");
const teamsSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/paths/teams.yaml");
const marksSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/paths/marks.yaml");
const noticesSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/paths/notices.yaml");

const mainSpec = YAML.load(mainSpecUrl);
const authSpec = YAML.load(authSpecUrl);
const usersSpec = YAML.load(usersSpecUrl);
const studentsSpec = YAML.load(studentsSpecUrl);
const teachersSpec = YAML.load(teachersSpecUrl);
const splsSpec = YAML.load(splsSpecUrl);
const marksSpec = YAML.load(mainSpecUrl);
const teamsSpec = YAML.load(teamsSpecUrl);
const noticesSpec = YAML.load(noticesSpecUrl);
const componentsSpec = YAML.load(componentsSpecUrl);

const apiSpec = {
    ...mainSpec,
    paths: {
        ...mainSpec.paths,
        ...authSpec.paths,
        ...usersSpec.paths,
        ...teachersSpec.paths,
        ...studentsSpec.paths,
        ...teamsSpec.paths,
        ...splsSpec.paths,
        ...noticesSpec.paths,
        ...marksSpec.paths,
    },
    components: {
        ...mainSpec.components,
        ...componentsSpec.components,
    },
};

export default { swaggerServe: swaggerUI.serve, swaggerSetup: swaggerUI.setup(apiSpec) };
