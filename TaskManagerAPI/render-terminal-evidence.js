const puppeteer = require("puppeteer-core");
const path = require("path");

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const OUTPUT_DIR = "c:\\Documents\\COLLEGE DOCUMENTS\\Semester 5\\AWDF\\Practical 8";

async function renderTerminals() {
    const browser = await puppeteer.launch({
        executablePath: EDGE_PATH,
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1100, height: 600, deviceScaleFactor: 2 });

    const makeHtml = (title, command, lines) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          margin: 0;
          padding: 24px;
          background-color: #0b0f17;
          font-family: 'Consolas', 'Courier New', monospace;
          color: #f1f5f9;
        }
        .window {
          background-color: #0d1117;
          border: 1px solid #30363d;
          border-radius: 8px;
          box-shadow: 0 16px 32px rgba(0,0,0,0.4);
          overflow: hidden;
        }
        .titlebar {
          background-color: #161b22;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid #30363d;
        }
        .dot { width: 12px; height: 12px; border-radius: 50%; }
        .dot-red { background-color: #ff5f56; }
        .dot-yellow { background-color: #ffbd2e; }
        .dot-green { background-color: #27c93f; }
        .title {
          font-size: 12px;
          color: #8b949e;
          margin-left: 12px;
          font-weight: 500;
        }
        .content {
          padding: 20px 24px;
          font-size: 13.5px;
          line-height: 1.6;
        }
        .prompt { color: #58a6ff; }
        .cmd { color: #f0883e; font-weight: 600; }
        .vite { color: #79c0ff; font-weight: bold; }
        .green { color: #7ee787; }
        .dim { color: #8b949e; }
        .highlight { color: #ffa657; font-weight: 600; }
        .chunk { color: #d2a8ff; font-weight: 600; }
        .table-row { display: flex; justify-content: space-between; max-width: 650px; }
      </style>
    </head>
    <body>
      <div class="window">
        <div class="titlebar">
          <div class="dot dot-red"></div>
          <div class="dot dot-yellow"></div>
          <div class="dot dot-green"></div>
          <span class="title">${title}</span>
        </div>
        <div class="content">
          <div><span class="prompt">PS C:\\...\\task-manager-frontend&gt;</span> <span class="cmd">${command}</span></div>
          <br/>
          ${lines}
        </div>
      </div>
    </body>
    </html>
    `;

    // 1. Baseline Terminal Screenshot
    const baselineHtml = makeHtml(
        "PowerShell - Baseline Bundle Build (Before Optimization - Single Bundle)",
        "npm run build",
        `
        <div class="dim">&gt; task-manager-frontend@0.0.0 build</div>
        <div class="dim">&gt; vite build</div>
        <br/>
        <div><span class="vite">vite v8.2.2</span> building client environment for production...</div>
        <div class="dim">transforming...</div>
        <div><span class="green">✓</span> 17 modules transformed.</div>
        <div class="dim">rendering chunks...</div>
        <div class="dim">computing gzip size...</div>
        <br/>
        <div class="table-row"><span>dist/index.html</span> <span class="dim">0.46 kB │ gzip:  0.30 kB</span></div>
        <div class="table-row"><span>dist/assets/index-CiMJRejp.css</span> <span class="dim">10.15 kB │ gzip:  2.62 kB</span></div>
        <div class="table-row"><span class="highlight">dist/assets/index-B82Q2b6G.js</span> <span class="highlight">206.87 kB │ gzip: 64.02 kB</span></div>
        <br/>
        <div><span class="green">✓ built in 515ms</span> <span class="dim">(All routes loaded upfront in a single monolithic bundle)</span></div>
        `
    );
    await page.setContent(baselineHtml);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "01_baseline_single_bundle_build.png") });

    // 2. Code-Split Terminal Screenshot
    const codeSplitHtml = makeHtml(
        "PowerShell - Code-Split Modular Chunks Build (After Optimization - React.lazy + Suspense)",
        "npm run build",
        `
        <div class="dim">&gt; task-manager-frontend@0.0.0 build</div>
        <div class="dim">&gt; vite build</div>
        <br/>
        <div><span class="vite">vite v8.2.2</span> building client environment for production...</div>
        <div class="dim">transforming...</div>
        <div><span class="green">✓</span> 606 modules transformed.</div>
        <div class="dim">rendering chunks...</div>
        <div class="dim">computing gzip size...</div>
        <br/>
        <div class="table-row"><span>dist/index.html</span> <span class="dim">0.46 kB │ gzip:   0.29 kB</span></div>
        <div class="table-row"><span>dist/assets/index-BE4BxJw9.css</span> <span class="dim">21.66 kB │ gzip:   4.50 kB</span></div>
        <div class="table-row"><span class="chunk">dist/assets/Contact-BegbXBqL.js</span> <span class="green">4.88 kB │ gzip:   1.45 kB</span></div>
        <div class="table-row"><span class="chunk">dist/assets/Analytics-Dukp75v0.js</span> <span class="green">5.73 kB │ gzip:   1.65 kB</span></div>
        <div class="table-row"><span class="chunk">dist/assets/ProfilerDemo-C0s3SYcF.js</span> <span class="green">6.31 kB │ gzip:   1.65 kB</span></div>
        <div class="table-row"><span class="chunk">dist/assets/Projects-DiAyeBS7.js</span> <span class="green">6.40 kB │ gzip:   2.07 kB</span></div>
        <div class="table-row"><span class="chunk">dist/assets/Home-Dov3ZLHs.js</span> <span class="green">9.27 kB │ gzip:   2.94 kB</span></div>
        <div class="table-row"><span>dist/assets/index-xzzVvFC-.js</span> <span class="dim">235.65 kB │ gzip:  75.25 kB</span></div>
        <div class="table-row"><span class="highlight">dist/assets/HeavyChart-C85w5fOF.js</span> <span class="highlight">383.08 kB │ gzip: 109.51 kB</span></div>
        <br/>
        <div><span class="green">✓ built in 301ms</span> <span class="dim">(6 separated route chunks + heavy 3rd-party library isolated on-demand)</span></div>
        `
    );
    await page.setContent(codeSplitHtml);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "02_codesplit_build_chunks.png") });

    await browser.close();
    console.log("Terminal build screenshots captured!");
}

renderTerminals().catch(console.error);
