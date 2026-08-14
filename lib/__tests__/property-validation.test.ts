import { describe, it, expect } from "vitest";
import { propertySearchQuerySchema, propertySchema } from "../validations/property";

describe("propertySearchQuerySchema", () => {
  it("applies sane defaults with no query params", () => {
    const result = propertySearchQuerySchema.parse({});
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(12);
    expect(result.sort).toBe("newest");
  });

  it("caps pageSize at 50 to prevent unbounded result dumps", () => {
    const result = propertySearchQuerySchema.safeParse({ pageSize: "500" });
    expect(result.success).toBe(false);
  });

  it("rejects a negative page number", () => {
    const result = propertySearchQuerySchema.safeParse({ page: "-1" });
    expect(result.success).toBe(false);
  });

  it("coerces numeric strings from URL search params", () => {
    const result = propertySearchQuerySchema.parse({ page: "3", maxRent: "15000" });
    expect(result.page).toBe(3);
    expect(result.maxRent).toBe(15000);
  });

  it("rejects an invalid property type", () => {
    const result = propertySearchQuerySchema.safeParse({ type: "MANSION" });
    expect(result.success).toBe(false);
  });
});

describe("propertySchema", () => {
  const validProperty = {
    title: "Cozy PG near campus",
    rent: 8000,
    rentType: "PER_BED",
    address: "123 Main Street",
    city: "Jaipur",
    state: "Rajasthan",
    zipcode: "302001",
    type: "PG",
    gender: "UNISEX",
    occupancy: "DOUBLE",
  };

  it("accepts a minimal valid property", () => {
    const result = propertySchema.safeParse(validProperty);
    expect(result.success).toBe(true);
  });

  it("rejects a non-positive rent", () => {
    const result = propertySchema.safeParse({ ...validProperty, rent: -100 });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed zipcode", () => {
    const result = propertySchema.safeParse({ ...validProperty, zipcode: "abc" });
    expect(result.success).toBe(false);
  });

  it("rejects an out-of-range latitude", () => {
    const result = propertySchema.safeParse({ ...validProperty, latitude: 200 });
    expect(result.success).toBe(false);
  });

  it("defaults isFurnished and isAvailable when omitted", () => {
    const result = propertySchema.parse(validProperty);
    expect(result.isFurnished).toBe(false);
    expect(result.isAvailable).toBe(true);
  });
});
