import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";

import path from "path";
import { getDirectoryName } from "../utils/fileUtils.js";
const mainSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/main.yaml");
const authSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/paths/auth.yaml");
const usersSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/paths/user.yaml");
const studentsSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/paths/student.yaml");
const teachersSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/paths/teacher.yaml");
const splsSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/paths/spl.yaml");
const teamsSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/paths/team.yaml");
const marksSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/paths/mark.yaml");
const noticesSpecUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/paths/notice.yaml");

const authComponentUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/components/auth.yaml");
const studentComponentUrl = path.join(getDirectoryName(import.meta.url), "../api/docs/components/student.yaml");

const mainSpec = YAML.load(mainSpecUrl);
const authSpec = YAML.load(authSpecUrl);
const usersSpec = YAML.load(usersSpecUrl);
const studentsSpec = YAML.load(studentsSpecUrl);
const teachersSpec = YAML.load(teachersSpecUrl);
const splsSpec = YAML.load(splsSpecUrl);
const marksSpec = YAML.load(marksSpecUrl);
const teamsSpec = YAML.load(teamsSpecUrl);
const noticesSpec = YAML.load(noticesSpecUrl);

const authComponentSpec = YAML.load(authComponentUrl);
const studentComponentSpec = YAML.load(studentComponentUrl);

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
        ...authComponentSpec.components,
        ...studentComponentSpec.components,
    },
};

export default { swaggerServe: swaggerUI.serve, swaggerSetup: swaggerUI.setup(apiSpec) };
