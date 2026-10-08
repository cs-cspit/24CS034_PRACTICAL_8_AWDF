const puppeteer = require("puppeteer-core");
const path = require("path");

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const OUTPUT_DIR = "c:\\Documents\\COLLEGE DOCUMENTS\\Semester 5\\AWDF\\Practical 8";

async function main() {
    const browser = await puppeteer.launch({
        executablePath: EDGE_PATH,
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1280,1100"]
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1100, deviceScaleFactor: 1.5 });
    await page.goto("http://localhost:5174/analytics", { waitUntil: "networkidle0" });
    await new Promise(r => setTimeout(r, 500));
    
    // Click button to show charts
    const btn = await page.$(".chart-section-header button");
    if (btn) {
        await btn.click();
        await new Promise(r => setTimeout(r, 1200));
    }
    
    // Scroll chart card into view
    await page.evaluate(() => {
        const el = document.querySelector(".chart-section-card");
        if (el) el.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 500));

    await page.screenshot({ path: path.join(OUTPUT_DIR, "06_analytics_heavy_chart_lazy.png") });
    await browser.close();
    console.log("06_analytics_heavy_chart_lazy.png successfully captured!");
}

main().catch(console.error);
