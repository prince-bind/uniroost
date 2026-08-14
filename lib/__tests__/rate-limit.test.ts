import { describe, it, expect } from "vitest";
import { rateLimit, getClientIp } from "../rate-limit";

describe("rateLimit", () => {
  it("allows requests under the limit", () => {
    const key = `test-${Math.random()}`;
    const first = rateLimit(key, 3, 1000);
    const second = rateLimit(key, 3, 1000);
    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
  });

  it("blocks requests once the limit is exceeded", () => {
    const key = `test-${Math.random()}`;
    rateLimit(key, 2, 1000);
    rateLimit(key, 2, 1000);
    const third = rateLimit(key, 2, 1000);
    expect(third.success).toBe(false);
    expect(third.remaining).toBe(0);
  });

  it("resets after the window expires", async () => {
    const key = `test-${Math.random()}`;
    rateLimit(key, 1, 50); // 50ms window
    const blocked = rateLimit(key, 1, 50);
    expect(blocked.success).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 60));

    const afterReset = rateLimit(key, 1, 50);
    expect(afterReset.success).toBe(true);
  });

  it("tracks separate keys independently", () => {
    const a = rateLimit("key-a", 1, 1000);
    const b = rateLimit("key-b", 1, 1000);
    expect(a.success).toBe(true);
    expect(b.success).toBe(true);
  });
});

describe("getClientIp", () => {
  it("reads x-forwarded-for from a Request", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "203.0.113.5, 10.0.0.1" },
    });
    expect(getClientIp(req)).toBe("203.0.113.5");
  });

  it("falls back to x-real-ip", () => {
    const req = new Request("http://localhost", {
      headers: { "x-real-ip": "203.0.113.9" },
    });
    expect(getClientIp(req)).toBe("203.0.113.9");
  });

  it("reads from a plain headers object", () => {
    expect(getClientIp({ "x-forwarded-for": "198.51.100.1" })).toBe("198.51.100.1");
  });

  it("returns 'unknown' when no IP headers are present", () => {
    const req = new Request("http://localhost");
    expect(getClientIp(req)).toBe("unknown");
  });
});
