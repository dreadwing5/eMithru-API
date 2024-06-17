// models/User.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY
);

class User {
  static async create(userData) {
    const { password, ...rest } = userData;

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { data: user, error } = await supabase
      .from("users")
      .insert([{ ...rest, password: hashedPassword, status: "active" }])
      .single();

    if (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }

    // Remove the password from the user object
    delete user.password;

    return user;
  }

  static async findById(id) {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`User not found with ID: ${id}`);
    }

    // Remove the password from the user object
    delete user.password;

    return user;
  }

  static async findByEmail(email) {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      throw new Error(`User not found with email: ${email}`);
    }

    // Remove the password from the user object
    delete user.password;

    return user;
  }

  static async update(id, userData) {
    const { password, ...rest } = userData;

    let updateData = rest;

    if (password) {
      // Hash the new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateData.password = hashedPassword;
    }

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }

    // Remove the password from the user object
    delete updatedUser.password;

    return updatedUser;
  }

  static async delete(id) {
    const { data: deletedUser, error } = await supabase
      .from("users")
      .delete()
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }

    // Remove the password from the user object
    delete deletedUser.password;

    return deletedUser;
  }

  static async findByRole(role) {
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", role);

    if (error) {
      throw new Error(`Error fetching users with role: ${role}`);
    }

    // Remove the password from each user object
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });

    return usersWithoutPassword;
  }

  static async updateRole(id, newRole) {
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error updating user role: ${error.message}`);
    }

    // Remove the password from the user object
    delete updatedUser.password;

    return updatedUser;
  }
}

export default User;
