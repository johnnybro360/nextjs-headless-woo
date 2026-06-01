import { z } from "zod";

export const orderLookupSchema = z.object({
  email: z.email("Enter the email used at checkout"),
  orderNumber: z
    .string()
    .min(1, "Order number is required")
    .max(32, "Order number is too long"),
});

export type OrderLookupSchemaValues = z.infer<typeof orderLookupSchema>;
