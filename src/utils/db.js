// utils/db.js
import { createClient } from "@supabase/supabase-js";
import logger from "./logger.js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PRIVATE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function connectDB() {
  try {
    // Test the connection by making a simple query
    const { data, error } = await supabase.from("users").select("*").limit(1);
    if (error) {
      throw error;
    }
    logger.info("DB CONNECTED SUCCESSFULLY!");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}

export { supabase, connectDB };
