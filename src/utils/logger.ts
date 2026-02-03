import winston from "winston";

export enum ModuleType {
  Controller = "CONTROLLER",
  Service = "SERVICE",
  Model = "MODEL",
  Repository = "REPOSITORY",
  Route = "ROUTE",
  Util = "UTIL",
  Job = "JOB",
  Config = "CONFIG",
  Entry = "ENTRY",
  Middleware = "MIDDLEWARE",
}

function format(mod: ModuleType, feature: string, text: string): string {
  return `[${mod}:${feature}] ${text}`;
}
const logLevel = "info"; //NOTE: this should come from config file

const createLogger = (mod: ModuleType, feature: string) => {
  const levels = {
    emergency: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
  };

  const colors = {
    emergency: "red",
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "gray",
  };

  winston.addColors(colors);

  const transports = [
    new winston.transports.Console({
      level: logLevel,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.json()
      ),
    }),
  ];

  const logger = winston.createLogger({
    levels,
    silent: false,
    transports,
  });

  return {
    error(message, error?: any) {
      logger.error(format(mod, feature, message), {
        error,
      });
    },
    warn(message, data) {
      logger.warn(format(mod, feature, message), {
        data,
      });
    },
    info(message, data) {
      logger.info(format(mod, feature, message), {
        data,
      });
    },
    debug(message, data) {
      logger.debug(format(mod, feature, message)),
        {
          data,
        };
    },
  };
};

// Reference Usage:
// const logger = createLogger( ModuleType.Controller, "AUTH" );
// logger.info("User created", { userId: 123 });

export default createLogger;
