import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY
);

const Attendance = {
  async find() {
    const { data, error } = await supabase.from("attendances").select("*");

    if (error) {
      throw new Error(`Error retrieving attendances: ${error.message}`);
    }

    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("attendances")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error retrieving attendance: ${error.message}`);
    }

    return data;
  },

  async create(attendanceData) {
    const { data, error } = await supabase
      .from("attendances")
      .insert(attendanceData)
      .single();

    if (error) {
      throw new Error(`Error creating attendance: ${error.message}`);
    }

    return data;
  },

  async update(id, updateData) {
    const { data, error } = await supabase
      .from("attendances")
      .update(updateData)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error updating attendance: ${error.message}`);
    }

    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from("attendances")
      .delete()
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error deleting attendance: ${error.message}`);
    }

    return data;
  },
};

export default Attendance;
