import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY
);

const Notification = {
  async find() {
    const { data, error } = await supabase.from("notifications").select("*");

    if (error) {
      throw new Error(`Error retrieving notifications: ${error.message}`);
    }

    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error retrieving notification: ${error.message}`);
    }

    return data;
  },

  async create(notificationData) {
    const { data, error } = await supabase
      .from("notifications")
      .insert(notificationData)
      .single();

    if (error) {
      throw new Error(`Error creating notification: ${error.message}`);
    }

    return data;
  },

  async update(id, updateData) {
    const { data, error } = await supabase
      .from("notifications")
      .update(updateData)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error updating notification: ${error.message}`);
    }

    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error deleting notification: ${error.message}`);
    }

    return data;
  },
};

export default Notification;
