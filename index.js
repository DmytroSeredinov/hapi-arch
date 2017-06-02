"use strict";

const co = require("co");
const archLog = require("./lib/archLog");
const locations = require("./lib/locations");
const archFs = require("./lib/archFs");
const ERRORS = require("./lib/text/errors.json");
const config = require("./config");
const moment = require("moment");
const _ = require("lodash");
const env = process.env.NODE_ENV || "development";
const appConfig = require("./lib/config")(env);
const pkg = require("./package.json");
const archServices = require("./lib/archServices");

module.exports = function () {

  archLog.info(`Welcome to Hapi Arch v${pkg.version}`);

  global._ = _;
  global.moment = moment;
  global.TEST = [];
  global.ENV = env;
  global.CONFIG = appConfig;

  const register = function (server, options, next) {

    co(function* () {

      try {

        if (config.archServices && config.archServices.length) {
          yield archServices(config.archServices, appConfig);
        }

        const pluginsPath =
          archFs.join(
            locations.APP_MIN_DIR || process.cwd(),
            archFs.formatPath(config.paths.plugins)
          );

        const pluginsLoader = require("./lib/plugins");
        const plugins = pluginsLoader(pluginsPath) || [];

        if (plugins.length) {

          server.register(plugins);
          archLog.info(`${plugins.length} ${ plugins.length > 1 ? "Plugins" : "Plugin" } Loaded!`);

          archLog.info(`Environment >> ${env}`);
          archLog.info(`API documentation @ ${server.info.uri}/documentation`);
          console.log(" ");
          next();

        }
        else {
          archLog.error(ERRORS.NO_PLUGINS);
          process.exit(1);
        }

      }
      catch (err) {
        archLog.error(err);
        process.exit(1);
      }

    });

  };

  register.attributes = {
    pkg: pkg
  };

  return register;

};