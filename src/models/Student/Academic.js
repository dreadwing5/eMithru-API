import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY
);

const Academics = {
  async find() {
    const { data, error } = await supabase.from("academics").select("*");

    if (error) {
      throw new Error(`Error retrieving academics: ${error.message}`);
    }

    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("academics")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error retrieving academics: ${error.message}`);
    }

    return data;
  },

  async create(academicsData) {
    const { data, error } = await supabase
      .from("academics")
      .insert(academicsData)
      .single();

    if (error) {
      throw new Error(`Error creating academics: ${error.message}`);
    }

    return data;
  },

  async update(id, updateData) {
    const { data, error } = await supabase
      .from("academics")
      .update(updateData)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error updating academics: ${error.message}`);
    }

    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from("academics")
      .delete()
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error deleting academics: ${error.message}`);
    }

    return data;
  },
};

export default Academics;
