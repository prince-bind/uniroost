-- Indexes to support property search filters (city/type/gender/rent) and
-- admin owner-verification queries. Without these, `findMany` on the
-- properties/users tables falls back to a sequential scan as data grows.

CREATE INDEX IF NOT EXISTS "properties_city_isAvailable_idx" ON "properties"("city", "isAvailable");
CREATE INDEX IF NOT EXISTS "properties_type_idx" ON "properties"("type");
CREATE INDEX IF NOT EXISTS "properties_gender_idx" ON "properties"("gender");
CREATE INDEX IF NOT EXISTS "properties_rent_idx" ON "properties"("rent");
CREATE INDEX IF NOT EXISTS "properties_ownerId_idx" ON "properties"("ownerId");
CREATE INDEX IF NOT EXISTS "properties_createdAt_idx" ON "properties"("createdAt");

CREATE INDEX IF NOT EXISTS "users_role_isVerified_idx" ON "users"("role", "isVerified");
