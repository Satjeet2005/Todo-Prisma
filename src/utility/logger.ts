import pino from "pino";

const transport = pino.transport({
  targets: [
    {
      target: "pino-pretty",
    },
    {
      target: "pino/file",
      options: { destination: "./app.log" },
    },
    {
      target: "@logtail/pino",
      options: {
        sourceToken: process.env.BETTER_STACK_LOG_TOKEN,
        options: {
          endpoint: process.env.BETTER_STACK_HOST,
        },
      },
    },
  ],
});

const logger = pino(
  { redact: { paths: ["email", "password"], remove: true } },
  transport,
);

export default logger;
