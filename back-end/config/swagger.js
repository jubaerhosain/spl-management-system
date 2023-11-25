import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
const swaggerJSDocs = YAML.load("api/api.yaml");

// const options = {
//     customCss: `img {content:url(\'../logo.svg\'); height:auto;} `,
//     customfavIcon: "../favicon.ico",
//     customSiteTitle: "Code Improve API Doc",

// };
// module.exports = { swaggerServe: swaggerUI.serve, swaggerSetup: swaggerUI.setup(swaggerJSDocs,options) };

export default { swaggerServe: swaggerUI.serve, swaggerSetup: swaggerUI.setup(swaggerJSDocs) };
