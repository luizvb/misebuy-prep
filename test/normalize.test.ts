import { describe, expect, it } from "vitest";
import { normalizeCsv, toCsv } from "../src/normalize";

describe("supplier list normalizer", () => {
  it("maps common headers and units", () => { const rows = normalizeCsv("Vendor,Product,Size,UOM,Cost\nA,Tomatoes,5,kilograms,$12.40"); expect(rows[0]).toEqual({ supplier:"A", item:"Tomatoes", pack_size:5, unit:"kg", pack_price:12.4 }); expect(toCsv(rows)).toContain("A,\"Tomatoes\",5,kg,12.40"); });
  it("rejects missing fields and unsupported units", () => { expect(() => normalizeCsv("Product,Cost\nOil,10")).toThrow(/missing/i); expect(() => normalizeCsv("Product,Size,UOM,Cost\nOil,2,gallon,10")).toThrow(/unsupported/i); });
  it("enforces local abuse limits", () => { expect(() => normalizeCsv("x".repeat(250_001))).toThrow(/250 KB/i); });
});
