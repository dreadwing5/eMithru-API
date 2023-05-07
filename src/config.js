import dotenv from "dotenv";

const path =
  process.env.NODE_ENV === "developement"
    ? ".env.development"
    : ".env.production";

dotenv.config({ path });
