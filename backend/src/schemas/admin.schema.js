const { z } = require("zod");

const adminregisterSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters").trim(),
        email: z.string().email("Invalid email address").trim(),
        password: z.string().min(8, "Password must be at least 8 characters").trim(),
        confirmPassword: z.string().min(1, "Confirm password is required").trim(),

        phone: z.string()
            .min(10, "Phone number must be at least 10 characters")
            .max(10, "Phone number must be exactly 10 characters")
            .regex(/^[0-9]+$/, "Phone number must contain only digits")
            .trim(),

        age: z
            .number({
                required_error: "Age is required",
                invalid_type_error: "Age must be a number",
            })
            .min(18, "Age must be at least 18")
            .max(100, "Age must be less than 100"),

        gender: z.enum(["male", "female", "other"], {
            required_error: "Gender is required",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

const adminloginSchema = z.object({
    email: z.string().email("Invalid email address").trim(),
    password: z.string().min(1, "Password is required"),
});

module.exports = { adminregisterSchema, adminloginSchema };