export interface NormalizedRow { supplier: string; item: string; pack_size: number; unit: "kg" | "l" | "each"; pack_price: number; }

const headerAliases: Record<string, string[]> = {
  supplier: ["supplier", "vendor", "distributor"], item: ["item", "product", "description", "name"],
  pack_size: ["pack_size", "pack size", "size", "qty", "quantity"], unit: ["unit", "uom", "measure"],
  pack_price: ["pack_price", "pack price", "price", "cost", "unit price"],
};

function split(line: string) { return line.split(/[,;\t]/).map((cell) => cell.trim().replace(/^"|"$/g, "")); }
function keyFor(header: string) { const value = header.toLowerCase().trim(); return Object.entries(headerAliases).find(([, aliases]) => aliases.includes(value))?.[0]; }
function normalizeUnit(raw: string): NormalizedRow["unit"] { const value = raw.toLowerCase(); if (["kg", "kilogram", "kilograms", "kilo"].includes(value)) return "kg"; if (["l", "liter", "litre", "liters", "litres"].includes(value)) return "l"; if (["ea", "each", "unit", "piece", "pc"].includes(value)) return "each"; throw new Error(`Unsupported unit: ${raw}`); }

export function normalizeCsv(input: string, defaultSupplier = "Supplier"): NormalizedRow[] {
  if (input.length > 250_000) throw new Error("File is larger than the 250 KB local limit.");
  const lines = input.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) throw new Error("Add a header and at least one price row.");
  if (lines.length > 501) throw new Error("Free tool accepts up to 500 rows.");
  const sourceHeaders = split(lines[0]);
  const mapped = sourceHeaders.map(keyFor);
  for (const required of ["item", "pack_size", "unit", "pack_price"]) if (!mapped.includes(required)) throw new Error(`Missing a column for ${required}.`);
  return lines.slice(1).map((line, index) => {
    const cells = split(line); const get = (key: string) => cells[mapped.indexOf(key)] ?? "";
    const pack_size = Number(get("pack_size")); const pack_price = Number(get("pack_price").replace(/[$€£]/g, ""));
    if (!get("item") || !Number.isFinite(pack_size) || pack_size <= 0 || !Number.isFinite(pack_price) || pack_price < 0) throw new Error(`Invalid values on row ${index + 2}.`);
    return { supplier: get("supplier") || defaultSupplier, item: get("item"), pack_size, unit: normalizeUnit(get("unit")), pack_price };
  });
}

export function toCsv(rows: NormalizedRow[]) { return ["supplier,item,pack_size,unit,pack_price", ...rows.map((row) => [row.supplier, `"${row.item.replaceAll('"', '""')}"`, row.pack_size, row.unit, row.pack_price.toFixed(2)].join(","))].join("\n"); }
