import { z } from "zod";

export const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address1: z.string().min(1, "Street address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State / region is required"),
  postcode: z.string().min(1, "Postcode is required"),
  country: z.string().min(2, "Country code is required"),
});

export type CheckoutSchemaValues = z.infer<typeof checkoutSchema>;
