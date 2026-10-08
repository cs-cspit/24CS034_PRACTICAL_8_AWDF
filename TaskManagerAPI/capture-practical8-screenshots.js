const puppeteer = require("puppeteer-core");
const path = require("path");

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE_URL = "http://localhost:5174";
const OUTPUT_DIR = "c:\\Documents\\COLLEGE DOCUMENTS\\Semester 5\\AWDF\\Practical 8";

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function capture() {
    console.log("Launching Microsoft Edge via puppeteer-core...");
    const browser = await puppeteer.launch({
        executablePath: EDGE_PATH,
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1280,840"]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 840, deviceScaleFactor: 1.5 });

    // Track chunk network requests
    const loadedChunks = [];
    page.on('response', response => {
        const url = response.url();
        if (url.includes('/assets/') && url.endsWith('.js')) {
            const filename = url.split('/').pop();
            loadedChunks.push(filename);
            console.log(`[Network Transfer] Chunk loaded: ${filename}`);
        }
    });

    // 1. Visit Home (Tasks Dashboard)
    console.log("1. Capturing Home / Tasks Dashboard view...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });
    await sleep(600);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "03_home_tasks_dashboard.png") });

    // 2. Navigate to Projects (Observe Suspense Fallback then Projects view)
    console.log("2. Capturing Projects Route (dynamic chunk loading)...");
    await page.click("a[href='/projects']");
    await sleep(600);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "04_projects_lazy_chunk_loaded.png") });

    // 3. Fallback UI capture with simulated latency
    console.log("3. Capturing Suspense Fallback UI...");
    // Select Slow 3G network simulation
    await page.select(".latency-select", "800");
    await sleep(200);
    // Click contact to trigger fallback briefly
    await page.evaluate(() => {
        // Trigger a navigation that reveals the fallback or mount fallback
        window.history.pushState({}, '', '/contact');
    });
    // Direct screenshot of Suspense fallback element or navigate to slow route
    await page.goto(`${BASE_URL}/contact`, { waitUntil: "domcontentloaded" });
    // Grab immediate screenshot during Suspense fallback
    await sleep(150);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "05_suspense_fallback_loading.png") });

    // Wait for contact to fully resolve
    await sleep(1000);
    console.log("4. Capturing Contact Page view...");
    await page.screenshot({ path: path.join(OUTPUT_DIR, "07_contact_page_view.png") });

    // 5. Navigate to Analytics page
    console.log("5. Capturing Analytics Page with Recharts chunk deferred...");
    await page.goto(`${BASE_URL}/analytics`, { waitUntil: "networkidle0" });
    await sleep(600);
    
    // Click button to dynamically load the heavy Recharts charting component
    console.log("Loading heavy Recharts chunk dynamically...");
    const loadChartsBtn = await page.$("button.btn-primary");
    if (loadChartsBtn) {
        await loadChartsBtn.click();
        await sleep(1200); // Wait for recharts bundle to download and render
    }
    await page.screenshot({ path: path.join(OUTPUT_DIR, "06_analytics_heavy_chart_lazy.png") });

    // 6. Navigate to Profiler Demo page
    console.log("6. Capturing React DevTools Profiler & Memoization Audit...");
    await page.goto(`${BASE_URL}/profiler`, { waitUntil: "networkidle0" });
    await sleep(600);

    // Type in parent input and click counter to show unmemoized vs memoized renders
    const input = await page.$(".control-item input");
    if (input) {
        await input.type("Perf audit");
        await sleep(300);
    }
    const incBtn = await page.$(".control-item:nth-child(2) button");
    if (incBtn) {
        await incBtn.click();
        await sleep(200);
        await incBtn.click();
        await sleep(200);
        await incBtn.click();
        await sleep(200);
    }
    await page.screenshot({ path: path.join(OUTPUT_DIR, "08_devtools_profiler_memoization.png") });

    await browser.close();
    console.log("All UI screenshots successfully captured!");
}

capture().catch(err => {
    console.error("Capture failed:", err);
    process.exit(1);
});
