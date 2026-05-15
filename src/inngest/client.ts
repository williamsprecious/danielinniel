import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "danielinniel",
  checkpointing: {
    maxRuntime: "240s",
  },
});
