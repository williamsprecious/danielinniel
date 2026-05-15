import arcjet, { shield } from "@arcjet/next";

export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [shield({ mode: "LIVE" })],
});
