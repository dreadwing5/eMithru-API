import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY
);

const Message = {
  async find() {
    const { data, error } = await supabase.from("messages").select("*");

    if (error) {
      throw new Error(`Error retrieving messages: ${error.message}`);
    }

    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error retrieving message: ${error.message}`);
    }

    return data;
  },

  async create(messageData) {
    const { data, error } = await supabase
      .from("messages")
      .insert(messageData)
      .single();

    if (error) {
      throw new Error(`Error creating message: ${error.message}`);
    }

    return data;
  },

  async update(id, updateData) {
    const { data, error } = await supabase
      .from("messages")
      .update(updateData)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error updating message: ${error.message}`);
    }

    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from("messages")
      .delete()
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error deleting message: ${error.message}`);
    }

    return data;
  },
};

export default Message;
