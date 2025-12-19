import configYaml from "config-yaml";

const config = configYaml(`${__dirname}/src/config.yaml`);


export {config}