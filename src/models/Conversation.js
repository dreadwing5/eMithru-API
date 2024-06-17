import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY
);

const getConversations = async () => {
  const { data, error } = await supabase
    .from("private_conversations")
    .select("*");

  if (error) {
    throw new Error(`Error retrieving conversations: ${error.message}`);
  }

  return data;
};

const createConversation = async (conversationData) => {
  const { data, error } = await supabase
    .from("private_conversations")
    .insert(conversationData)
    .single();

  if (error) {
    throw new Error(`Error creating conversation: ${error.message}`);
  }

  return data;
};

export { getConversations, createConversation };
