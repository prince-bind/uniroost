import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().trim().min(5).max(150),
  description: z.string().trim().max(2000).optional().nullable(),
  rent: z.coerce.number().int().positive().max(10_000_000),
  rentType: z.enum(["PER_BED", "PER_ROOM"]),

  address: z.string().trim().min(5).max(300),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  zipcode: z.string().trim().regex(/^\d{5,6}$/, "Enter a valid zipcode"),

  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),

  type: z.enum(["PG", "FLAT"]),
  gender: z.enum(["BOYS", "GIRLS", "UNISEX"]),
  occupancy: z.enum(["SINGLE", "DOUBLE", "TRIPLE"]),
  isFurnished: z.boolean().default(false),
  isAvailable: z.boolean().default(true),

  amenityIds: z.array(z.string().cuid2().or(z.string().min(1))).max(50).default([]),
  imageUrls: z.array(z.string().url()).max(20).default([]),
  colleges: z
    .array(
      z.object({
        collegeId: z.string().min(1),
        distanceKm: z.coerce.number().min(0).max(500),
      })
    )
    .max(10)
    .default([]),
});

export type PropertyInput = z.infer<typeof propertySchema>;

/** Query params accepted by GET /api/properties (public search). */
export const propertySearchQuerySchema = z.object({
  city: z.string().trim().max(100).optional(),
  type: z.enum(["PG", "FLAT"]).optional(),
  gender: z.enum(["BOYS", "GIRLS", "UNISEX"]).optional(),
  minRent: z.coerce.number().int().nonnegative().optional(),
  maxRent: z.coerce.number().int().positive().optional(),
  collegeId: z.string().trim().optional(),
  page: z.coerce.number().int().positive().max(1000).default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(12),
  sort: z.enum(["newest", "rent_asc", "rent_desc"]).default("newest"),
});

export type PropertySearchQuery = z.infer<typeof propertySearchQuerySchema>;
