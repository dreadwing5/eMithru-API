import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY
);

const PTMRecord = {
  async find() {
    const { data, error } = await supabase.from("ptm_records").select("*");

    if (error) {
      throw new Error(`Error retrieving PTM records: ${error.message}`);
    }

    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("ptm_records")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error retrieving PTM record: ${error.message}`);
    }

    return data;
  },

  async create(ptmData) {
    const { data, error } = await supabase
      .from("ptm_records")
      .insert(ptmData)
      .single();

    if (error) {
      throw new Error(`Error creating PTM record: ${error.message}`);
    }

    return data;
  },

  async update(id, updateData) {
    const { data, error } = await supabase
      .from("ptm_records")
      .update(updateData)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error updating PTM record: ${error.message}`);
    }

    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from("ptm_records")
      .delete()
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error deleting PTM record: ${error.message}`);
    }

    return data;
  },
};

export default PTMRecord;
