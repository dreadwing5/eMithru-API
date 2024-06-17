import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY
);

const Meeting = {
  async find() {
    const { data, error } = await supabase.from("meetings").select("*");

    if (error) {
      throw new Error(`Error retrieving meetings: ${error.message}`);
    }

    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error retrieving meeting: ${error.message}`);
    }

    return data;
  },

  async create(meetingData) {
    const { data, error } = await supabase
      .from("meetings")
      .insert(meetingData)
      .single();

    if (error) {
      throw new Error(`Error creating meeting: ${error.message}`);
    }

    return data;
  },

  async update(id, updateData) {
    const { data, error } = await supabase
      .from("meetings")
      .update(updateData)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error updating meeting: ${error.message}`);
    }

    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from("meetings")
      .delete()
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error deleting meeting: ${error.message}`);
    }

    return data;
  },
};

export default Meeting;
