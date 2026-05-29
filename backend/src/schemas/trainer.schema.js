const { z } = require("zod");

const trainerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email address").trim(),
  phone: z.string().min(10, "Phone number must be at least 10 characters").trim(),
  experience: z.number({
    required_error: "Experience is required",
    invalid_type_error: "Experience must be a number",
  }).min(0, "Experience cannot be negative"),
  specialization: z.array(z.string()).optional(),
  bio: z.string().optional(),
  availableSlots: z.array(z.string()).optional(),
  image: z.string().optional(),
  socialLinks: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

module.exports = {
  trainerSchema,
};
