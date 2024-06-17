import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY
);

const Thread = {
  async find() {
    const { data, error } = await supabase.from("threads").select("*");

    if (error) {
      throw new Error(`Error retrieving threads: ${error.message}`);
    }

    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("threads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error retrieving thread: ${error.message}`);
    }

    return data;
  },

  async create(threadData) {
    const { data, error } = await supabase
      .from("threads")
      .insert(threadData)
      .single();

    if (error) {
      throw new Error(`Error creating thread: ${error.message}`);
    }

    return data;
  },

  async update(id, updateData) {
    const { data, error } = await supabase
      .from("threads")
      .update(updateData)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error updating thread: ${error.message}`);
    }

    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from("threads")
      .delete()
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error deleting thread: ${error.message}`);
    }

    return data;
  },
};

export default Thread;
