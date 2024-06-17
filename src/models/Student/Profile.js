import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY
);

const StudentProfile = {
  async find() {
    const { data, error } = await supabase.from("student_profiles").select("*");

    if (error) {
      throw new Error(`Error retrieving student profiles: ${error.message}`);
    }

    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error retrieving student profile: ${error.message}`);
    }

    return data;
  },

  async create(profileData) {
    const { data, error } = await supabase
      .from("student_profiles")
      .insert(profileData)
      .single();

    if (error) {
      throw new Error(`Error creating student profile: ${error.message}`);
    }

    return data;
  },

  async update(id, updateData) {
    const { data, error } = await supabase
      .from("student_profiles")
      .update(updateData)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error updating student profile: ${error.message}`);
    }

    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from("student_profiles")
      .delete()
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error deleting student profile: ${error.message}`);
    }

    return data;
  },
};

export default StudentProfile;
