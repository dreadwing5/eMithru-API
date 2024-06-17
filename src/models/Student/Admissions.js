import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY
);

const Admission = {
  async find() {
    const { data, error } = await supabase.from("admissions").select("*");

    if (error) {
      throw new Error(`Error retrieving admissions: ${error.message}`);
    }

    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("admissions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error retrieving admission: ${error.message}`);
    }

    return data;
  },

  async create(admissionData) {
    const { data, error } = await supabase
      .from("admissions")
      .insert(admissionData)
      .single();

    if (error) {
      throw new Error(`Error creating admission: ${error.message}`);
    }

    return data;
  },

  async update(id, updateData) {
    const { data, error } = await supabase
      .from("admissions")
      .update(updateData)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error updating admission: ${error.message}`);
    }

    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from("admissions")
      .delete()
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error deleting admission: ${error.message}`);
    }

    return data;
  },
};

export default Admission;
