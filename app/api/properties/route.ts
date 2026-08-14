import { prisma } from "@/lib/prisma";
import { ok, withErrorHandling } from "@/lib/api-response";
import { propertySearchQuerySchema } from "@/lib/validations/property";
import type { Prisma } from "../../../generated/prisma/client";

/**
 * GET /api/properties?city=&type=&gender=&minRent=&maxRent=&collegeId=&page=&pageSize=&sort=
 *
 * Public, paginated, filterable listing search. This exists as a proper
 * documented endpoint alongside the server-component query used by the
 * /search page, so the same data is reachable from a mobile client,
 * a Postman collection, or any future frontend without duplicating logic.
 */
export const GET = withErrorHandling(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const query = propertySearchQuerySchema.parse(Object.fromEntries(searchParams));

  const where: Prisma.PropertyWhereInput = { isAvailable: true };
  if (query.city) where.city = { contains: query.city, mode: "insensitive" };
  if (query.type) where.type = query.type;
  if (query.gender) where.gender = query.gender;
  if (query.minRent !== undefined || query.maxRent !== undefined) {
    where.rent = {
      ...(query.minRent !== undefined ? { gte: query.minRent } : {}),
      ...(query.maxRent !== undefined ? { lte: query.maxRent } : {}),
    };
  }
  if (query.collegeId) {
    where.colleges = { some: { collegeId: query.collegeId } };
  }

  const orderBy: Prisma.PropertyOrderByWithRelationInput =
    query.sort === "rent_asc"
      ? { rent: "asc" }
      : query.sort === "rent_desc"
        ? { rent: "desc" }
        : { createdAt: "desc" };

  const skip = (query.page - 1) * query.pageSize;

  const [items, total] = await prisma.$transaction([
    prisma.property.findMany({
      where,
      orderBy,
      skip,
      take: query.pageSize,
      include: {
        images: { take: 1 },
        amenities: { include: { amenity: true }, take: 4 },
        colleges: { include: { college: true }, take: 1 },
        owner: { select: { name: true, isVerified: true } },
      },
    }),
    prisma.property.count({ where }),
  ]);

  return ok({
    items,
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
    },
  });
});
