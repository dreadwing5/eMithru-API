import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY
);

const PrivateConversation = {
  async find() {
    const { data, error } = await supabase
      .from("private_conversations")
      .select("*");

    if (error) {
      throw new Error(
        `Error retrieving private conversations: ${error.message}`
      );
    }

    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("private_conversations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(
        `Error retrieving private conversation: ${error.message}`
      );
    }

    return data;
  },

  async create(conversationData) {
    const { data, error } = await supabase
      .from("private_conversations")
      .insert(conversationData)
      .single();

    if (error) {
      throw new Error(`Error creating private conversation: ${error.message}`);
    }

    return data;
  },

  async update(id, updateData) {
    const { data, error } = await supabase
      .from("private_conversations")
      .update(updateData)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error updating private conversation: ${error.message}`);
    }

    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from("private_conversations")
      .delete()
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error deleting private conversation: ${error.message}`);
    }

    return data;
  },
};

export default PrivateConversation;
