import "./styles.css";
import { normalizeCsv, toCsv } from "./normalize";

const sample = `Vendor,Product,Size,UOM,Cost
Harbor Foods,Roma tomatoes,4,kilograms,$13.60
Harbor Foods,Extra virgin olive oil,5,litres,$49.50
Harbor Foods,Parmesan cheese,1.5,kg,$30.75`;

document.querySelector<HTMLElement>("#app")!.innerHTML = `
  <header><a href="/"><img src="/logo.svg" alt=""><b>MiseBuy Prep</b></a><a href="https://misebuy.netolabs.dev">Open MiseBuy</a></header>
  <section class="hero"><div><p class="eyebrow">Free local tool</p><h1>Clean one supplier list in one pass.</h1><p>Paste a CSV with almost any common header names. Download the normalized file without an account or upload.</p></div><aside><strong>Local by default</strong><span>Up to 500 rows</span><span>250 KB maximum</span><span>No server processing</span></aside></section>
  <section class="tool"><div class="controls"><label for="supplier">Default supplier name</label><input id="supplier" value="Supplier"><label for="source">Price list</label><textarea id="source" placeholder="Vendor,Product,Size,UOM,Cost"></textarea><p id="hint">Your data stays in this browser tab.</p><div><button id="normalize">Normalize list</button><button id="sample" class="secondary">Use sample</button></div></div><div id="output" class="output empty"><h2>Normalized rows appear here.</h2><p>Supported delimiters: comma, semicolon, and tab.</p></div></section>
  <section class="relationship"><h2>Prep cleans the file. MiseBuy compares the order.</h2><p>This tool is useful on its own. When you have two or more lists, send the normalized CSVs to MiseBuy for a buying plan.</p><a href="https://misebuy.netolabs.dev">Compare suppliers</a></section>
  <footer><span>MIT licensed</span><a href="https://github.com/luizvb/misebuy-prep">Source and security</a></footer>`;

const source = document.querySelector<HTMLTextAreaElement>("#source")!;
const supplier = document.querySelector<HTMLInputElement>("#supplier")!;
const output = document.querySelector<HTMLElement>("#output")!;
document.querySelector("#sample")!.addEventListener("click", () => { source.value = sample; });
document.querySelector("#normalize")!.addEventListener("click", () => {
  try {
    const rows = normalizeCsv(source.value, supplier.value || "Supplier"); const csv = toCsv(rows);
    output.className = "output success"; output.innerHTML = `<div><h2>${rows.length} rows ready</h2><button id="download">Download CSV</button></div><pre>${csv.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</pre>`;
    document.querySelector("#download")!.addEventListener("click", () => { const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); const link = document.createElement("a"); link.href = url; link.download = "misebuy-normalized.csv"; link.click(); URL.revokeObjectURL(url); });
  } catch (error) { output.className = "output error"; output.innerHTML = `<h2>Check the source file.</h2><p>${error instanceof Error ? error.message : "Could not normalize this list."}</p>`; }
});
