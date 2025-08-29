import winston from "winston";
import path from "path";

// Determina il livello di log in base all'ambiente
const logLevel = process.env.NODE_ENV === "production" ? "error" : "debug";

// Configura il logger
const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(), // Aggiunge un timestamp ai log
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    // Log sulla console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Colora i livelli di log
        winston.format.simple() // Formato leggibile
      ),
    }),
    // Log su file
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "development.log"), // Percorso del file di log
      level: "debug", // Salva tutti i log di livello debug e superiori
    }),
  ],
});

export default logger;
