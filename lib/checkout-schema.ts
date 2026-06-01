import { z } from "zod";
import {
  AU_COUNTRY_CODE,
  AU_POSTCODE_REGEX,
  AU_STATE_CODE_ENUM,
} from "@/lib/au-address";

export const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Enter a valid email address"),
  phone: z
    .string()
    .min(8, "Enter a valid Australian phone number")
    .max(20, "Phone number is too long"),
  address1: z.string().min(1, "Street address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "Suburb / city is required"),
  state: z.enum(AU_STATE_CODE_ENUM, {
    error: "Select your state or territory",
  }),
  postcode: z
    .string()
    .regex(AU_POSTCODE_REGEX, "Enter a valid 4-digit Australian postcode"),
  country: z.literal(AU_COUNTRY_CODE, {
    error: "Orders are limited to Australia",
  }),
});

export type CheckoutSchemaValues = z.infer<typeof checkoutSchema>;
