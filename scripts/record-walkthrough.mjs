import { createServer } from 'vite';
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const recordingsDir = path.resolve(rootDir, 'recordings');
const artifactDir = 'C:\\Users\\Dell\\.gemini\\antigravity\\brain\\ad4a3960-fd26-4364-9f25-1739fd516fce';

if (!fs.existsSync(recordingsDir)) {
  fs.mkdirSync(recordingsDir, { recursive: true });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runWalkthrough() {
  console.log('--- Starting AuraPlan AI (UtsavOS) Walkthrough Recorder ---');
  const startTime = Date.now();

  // 1. Start Vite Server
  console.log('Starting Vite server...');
  const server = await createServer({
    root: rootDir,
    server: { port: 5173, strictPort: true },
  });
  await server.listen();
  console.log('Vite server running at http://localhost:5173');

  // 2. Launch Host Visible Google Chrome
  console.log('Launching host Google Chrome (Visible GUI)...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1366,850',
      '--disable-infobars',
    ],
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: recordingsDir,
      size: { width: 1280, height: 720 },
    },
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
  });

  try {
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await sleep(2500);

    // ========================================================
    // SECTION 1: Setup & Live QA Bar (0s - 14s)
    // ========================================================
    console.log('Walkthrough: Section 1 - Onboarding Wizard & Live QA Bar');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await sleep(1500);

    // Click Birthday Quick Preset
    const birthdayPreset = page.locator('button:has-text("Birthday")').first();
    if (await birthdayPreset.isVisible({ timeout: 1500 })) {
      await birthdayPreset.click();
      await sleep(2000);
    }

    // Click Hackathon Quick Preset
    const hackathonPreset = page.locator('button:has-text("Hackathon")').first();
    if (await hackathonPreset.isVisible({ timeout: 1500 })) {
      await hackathonPreset.click();
      await sleep(2000);
    }

    // Return to Wedding Quick Preset
    const weddingPreset = page.locator('button:has-text("Wedding")').first();
    if (await weddingPreset.isVisible({ timeout: 1500 })) {
      await weddingPreset.click();
      await sleep(2000);
    }

    // Live QA Bar Validation Demonstration
    const emailInput = page.locator('#organizerEmail').first();
    if (await emailInput.isVisible({ timeout: 1500 })) {
      await emailInput.click();
      await sleep(600);
      await emailInput.fill('invalid-email-format');
      await sleep(2500); // Viewer observes invalid warning in Live QA Bar
      await emailInput.fill('john@example.com');
      await sleep(2000); // Viewer observes green valid badge in Live QA Bar
    }

    // Scroll through the wizard to show guest count and dietary matrix
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await sleep(2000);

    // Submit wizard to navigate to Step 2
    const submitBtn = page.locator('button:has-text("Generate Complete Event Blueprint")').first();
    if (await submitBtn.isVisible({ timeout: 1500 })) {
      await submitBtn.click();
      await sleep(2500);
    } else {
      await page.keyboard.press('Alt+2');
      await sleep(2500);
    }

    // ========================================================
    // SECTION 2: Command Center Dashboard (14s - 25s)
    // ========================================================
    console.log('Walkthrough: Section 2 - Command Center Dashboard');
    await page.keyboard.press('Alt+2');
    await sleep(1500);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await sleep(1500);

    // Showcase Currency Switcher in Header
    const usdBtn = page.locator('header button:has-text("USD")').first();
    if (await usdBtn.isVisible({ timeout: 1500 })) {
      await usdBtn.click();
      await sleep(2000);
    }
    const inrBtn = page.locator('header button:has-text("INR")').first();
    if (await inrBtn.isVisible({ timeout: 1500 })) {
      await inrBtn.click();
      await sleep(2000);
    }

    // High Contrast Accessibility Toggle
    const contrastBtn = page.locator('button[aria-label="Toggle High Contrast Mode"]').first();
    if (await contrastBtn.isVisible({ timeout: 1500 })) {
      await contrastBtn.click();
      await sleep(1800);
      await contrastBtn.click();
      await sleep(1200);
    }

    // Smooth scroll down Dashboard to view KPI cards, weather, surge
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await sleep(2500);
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await sleep(2500);

    // ========================================================
    // SECTION 3: Parametric Budget Studio (25s - 35s)
    // ========================================================
    console.log('Walkthrough: Section 3 - Parametric Budget Studio');
    await page.keyboard.press('Alt+3');
    await sleep(2000);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await sleep(1500);

    // Showcase dynamic slider rebalancing
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        slider.value = '160000';
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await sleep(2500);

    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await sleep(2500);
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await sleep(2500);

    // ========================================================
    // SECTION 4: Critical Path Timeline & Run of Show Delays (35s - 46s)
    // ========================================================
    console.log('Walkthrough: Section 4 - Timeline & Run of Show');
    await page.keyboard.press('Alt+4');
    await sleep(2000);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await sleep(1500);

    // Simulate Delay Ripple (+45m HMU Delay)
    const delay45Btn = page.locator('button:has-text("+45m")').first();
    if (await delay45Btn.isVisible({ timeout: 1500 })) {
      await delay45Btn.click();
      await sleep(2500);
    }
    const delay30Btn = page.locator('button:has-text("+30m")').first();
    if (await delay30Btn.isVisible({ timeout: 1500 })) {
      await delay30Btn.click();
      await sleep(2500);
    }

    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await sleep(2500);

    // ========================================================
    // SECTION 5: Vendor Studio & Tranche Management (46s - 55s)
    // ========================================================
    console.log('Walkthrough: Section 5 - Vendor Studio');
    await page.keyboard.press('Alt+5');
    await sleep(2000);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await sleep(1500);

    // Toggle a checklist item to demonstrate readiness score increase
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    if (await firstCheckbox.isVisible({ timeout: 1500 })) {
      await firstCheckbox.click();
      await sleep(2000);
    }

    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await sleep(2500);

    // ========================================================
    // SECTION 6: GenAI Copilot Studio (55s - 65s)
    // ========================================================
    console.log('Walkthrough: Section 6 - GenAI Copilot Studio');
    await page.keyboard.press('Alt+6');
    await sleep(2000);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await sleep(1500);

    // Trigger AI Generation
    const generateAiBtn = page.locator('button:has-text("Execute Copilot & Inspect X-Ray"), button:has-text("Generate")').first();
    if (await generateAiBtn.isVisible({ timeout: 1500 })) {
      await generateAiBtn.click();
      await sleep(3500);
    }

    // ========================================================
    // SECTION 7: Prompt X-Ray Drawer (65s - 73s)
    // ========================================================
    console.log('Walkthrough: Section 7 - Prompt X-Ray Drawer');
    await page.keyboard.press('Alt+X');
    await sleep(3500);

    // Switch between X-Ray tabs
    const diffTab = page.locator('button:has-text("Dynamic Diff"), button:has-text("Diff")').first();
    if (await diffTab.isVisible({ timeout: 1500 })) {
      await diffTab.click();
      await sleep(2000);
    }

    // Close Prompt X-Ray Drawer
    await page.keyboard.press('Alt+X');
    await sleep(1500);

    // ========================================================
    // SECTION 8: Google Workspace Hub Modal (73s - 81s)
    // ========================================================
    console.log('Walkthrough: Section 8 - Google Workspace Hub Modal');
    const hubBtn = page.locator('button:has-text("Google Workspace Hub")').first();
    if (await hubBtn.isVisible({ timeout: 1500 })) {
      await hubBtn.click();
      await sleep(3000);

      // Close modal
      await page.keyboard.press('Escape');
      await sleep(1500);
    }

    // Final smooth scroll to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await sleep(2500);

  } catch (err) {
    console.error('Walkthrough step error:', err);
  } finally {
    // Ensure the total video duration is strictly > 50 seconds
    const currentElapsedSec = (Date.now() - startTime) / 1000;
    if (currentElapsedSec < 55) {
      const remainingWait = Math.ceil(55 - currentElapsedSec);
      console.log(`Video runtime currently ${currentElapsedSec.toFixed(1)}s. Waiting ${remainingWait}s more to guarantee >50s...`);
      await sleep(remainingWait * 1000);
    }

    const totalElapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`Walkthrough actions finished. Total recorded duration: ${totalElapsedSec}s`);

    const videoObj = page.video();
    let recordedFile = null;
    if (videoObj) {
      recordedFile = await videoObj.path();
    }

    await context.close();
    await browser.close();
    await server.close();

    console.log(`Video recorded successfully. Path: ${recordedFile}`);
    if (recordedFile && fs.existsSync(recordedFile)) {
      const targetName = path.resolve(recordingsDir, 'AuraPlan_UtsavOS_Complete_Walkthrough.webm');
      fs.copyFileSync(recordedFile, targetName);
      console.log(`Copied video to workspace: ${targetName}`);
      const stats = fs.statSync(targetName);
      console.log(`Video file size: ${(stats.size / 1024).toFixed(1)} KB`);

      // Also copy to Antigravity artifact directory
      if (fs.existsSync(artifactDir)) {
        const artifactVideo = path.resolve(artifactDir, 'AuraPlan_UtsavOS_Complete_Walkthrough.webm');
        fs.copyFileSync(recordedFile, artifactVideo);
        console.log(`Copied video to artifacts directory: ${artifactVideo}`);
      }
    }
  }
}

runWalkthrough().catch(console.error);
