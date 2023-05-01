import {
  createLogger,
  format as _format,
  transports as _transports,
} from "winston";

class Logger {
  constructor() {
    this.logger = createLogger({
      level: "info",
      format: _format.combine(_format.splat(), _format.json()),
      transports: [
        new _transports.File({ filename: "error.log", level: "error" }),
        new _transports.File({ filename: "combined.log" }),
      ],
    });

    if (process.env.NODE_ENV !== "production") {
      this.logger.add(
        new _transports.Console({
          format: _format.combine(
            _format.colorize(),
            _format.simple(),
            _format.splat(),
            _format.json()
          ),
        })
      );
    }
  }
}

const { logger } = new Logger();
export default logger;
