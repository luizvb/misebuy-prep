# MiseBuy Prep

Free local web tool that normalizes one restaurant supplier price list into MiseBuy's standard CSV schema.

## Use

1. Paste a CSV, TSV, or semicolon-separated list.
2. Select **Normalize list**.
3. Review and download the normalized CSV.

Accepted source aliases include `vendor`, `product`, `size`, `UOM`, and `cost`. Output columns are:

```text
supplier,item,pack_size,unit,pack_price
```

## Privacy and limits

- Runs entirely in the browser.
- No server upload or account.
- Maximum 500 rows and 250 KB.
- Strict unit allowlist: `kg`, `l`, `each` and common aliases.

## Development

```bash
pnpm install
pnpm check
pnpm dev
```

## Relationship to MiseBuy

Prep cleans one file. [MiseBuy](https://github.com/luizvb/misebuy) compares multiple suppliers, applies pack math, groups selected lines, and preserves history in paid plans. Prep remains independently useful and MIT licensed.

- Tool: https://misebuy-prep.netolabs.dev
- Product: https://misebuy.netolabs.dev
