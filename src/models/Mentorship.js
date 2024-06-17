import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY
);

const Mentorship = {
  async find() {
    const { data, error } = await supabase.from("mentorships").select("*");

    if (error) {
      throw new Error(`Error retrieving mentorships: ${error.message}`);
    }

    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("mentorships")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error retrieving mentorship: ${error.message}`);
    }

    return data;
  },

  async create(mentorshipData) {
    const { data: existingMentorships, error: countError } = await supabase
      .from("mentorships")
      .select("*", { count: "exact", head: true })
      .eq("mentor_id", mentorshipData.mentor_id);

    if (countError) {
      throw new Error(`Error counting mentorships: ${countError.message}`);
    }

    const maxStudentsPerMentor = 16;
    if (existingMentorships.length >= maxStudentsPerMentor) {
      throw new Error("A mentor cannot have more than 16 students.");
    }

    const { data, error } = await supabase
      .from("mentorships")
      .insert(mentorshipData)
      .single();

    if (error) {
      throw new Error(`Error creating mentorship: ${error.message}`);
    }

    return data;
  },

  async update(id, updateData) {
    const { data, error } = await supabase
      .from("mentorships")
      .update(updateData)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error updating mentorship: ${error.message}`);
    }

    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from("mentorships")
      .delete()
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error deleting mentorship: ${error.message}`);
    }

    return data;
  },
};

export default Mentorship;
