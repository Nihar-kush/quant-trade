import * as z from "zod";

export const OrderValidation = z.object({
  asset: z.string().min(1, "Asset is required"),
  quantity: z.number().positive("Quantity must be greater than 0"),
  price: z.number().positive("Price must be greater than 0"),
  expirationType: z.enum(["duration", "datetime"], {
    required_error: "Expiration type is required",
  }),
  expirationValue: z.string().nonempty("Expiration value is required"),
});
