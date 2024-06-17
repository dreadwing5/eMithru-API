import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY
);

const GroupConversation = {
  async find() {
    const { data, error } = await supabase
      .from("group_conversations")
      .select("*");

    if (error) {
      throw new Error(`Error retrieving group conversations: ${error.message}`);
    }

    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("group_conversations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error retrieving group conversation: ${error.message}`);
    }

    return data;
  },

  async create(conversationData) {
    const { data, error } = await supabase
      .from("group_conversations")
      .insert(conversationData)
      .single();

    if (error) {
      throw new Error(`Error creating group conversation: ${error.message}`);
    }

    return data;
  },

  async update(id, updateData) {
    const { data, error } = await supabase
      .from("group_conversations")
      .update(updateData)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error updating group conversation: ${error.message}`);
    }

    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from("group_conversations")
      .delete()
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error deleting group conversation: ${error.message}`);
    }

    return data;
  },
};

export default GroupConversation;
