import { createServer } from 'vite';
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const recordingsDir = path.resolve(rootDir, 'recordings');

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

  try {
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await sleep(3000);

    // ========================================================
    // SECTION 1: Onboarding Wizard (Archetypes, Form, Live QA Bar)
    // ========================================================
    console.log('Walkthrough: Section 1 - Onboarding Wizard & Live QA Bar');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await sleep(2000);

    // Click Birthday Archetype preset
    try {
      const birthdayCard = page.locator('text=Milestone 50th Birthday').first();
      if (await birthdayCard.isVisible({ timeout: 2000 })) {
        await birthdayCard.click();
        await sleep(2500);
      }
    } catch (e) {
      console.log('Birthday card skip:', e.message);
    }

    // Click Hackathon / Community Archetype preset
    try {
      const hackathonCard = page.locator('text=National AI & Web3 Hackathon').first();
      if (await hackathonCard.isVisible({ timeout: 2000 })) {
        await hackathonCard.click();
        await sleep(2500);
      }
    } catch (e) {
      console.log('Hackathon card skip:', e.message);
    }

    // Return to Heritage Royal Wedding preset
    try {
      const weddingCard = page.locator('text=Heritage Royal Wedding').first();
      if (await weddingCard.isVisible({ timeout: 2000 })) {
        await weddingCard.click();
        await sleep(2500);
      }
    } catch (e) {
      console.log('Wedding card skip:', e.message);
    }

    // Live QA Bar Validation Demonstration
    try {
      const emailInput = page.locator('input[type="email"], input[value*="@"]').first();
      if (await emailInput.isVisible({ timeout: 2000 })) {
        await emailInput.click();
        await sleep(1000);
        await emailInput.fill('invalid-email-format');
        await sleep(2500);
        await emailInput.fill('john@example.com');
        await sleep(2000);
      }
    } catch (e) {
      console.log('Email input skip:', e.message);
    }

    // Scroll through the wizard to show guest count and dietary matrix
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
    await sleep(2500);
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
    await sleep(2500);

    // Submit wizard to navigate to Step 2
    try {
      const submitBtn = page.locator('button:has-text("Generate Complete Event Blueprint")').first();
      if (await submitBtn.isVisible({ timeout: 2000 })) {
        await submitBtn.click();
        await sleep(3000);
      } else {
        await page.keyboard.press('Alt+2');
        await sleep(3000);
      }
    } catch {
      await page.keyboard.press('Alt+2');
      await sleep(3000);
    }

    // ========================================================
    // SECTION 2: Command Center Dashboard
    // ========================================================
    console.log('Walkthrough: Section 2 - Command Center Dashboard');
    await page.keyboard.press('Alt+2');
    await sleep(2000);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await sleep(2000);

    // Showcase Currency Switcher in Header
    try {
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
    } catch (e) {
      console.log('Currency switch skip:', e.message);
    }

    // High Contrast Accessibility Toggle
    try {
      const contrastBtn = page.locator('header button[aria-label*="contrast" i], header button:has-text("Contrast"), header button:has(.lucide-sun-moon)').first();
      if (await contrastBtn.isVisible({ timeout: 1500 })) {
        await contrastBtn.click();
        await sleep(2000);
        await contrastBtn.click();
        await sleep(1500);
      }
    } catch (e) {
      console.log('Contrast button skip:', e.message);
    }

    // Smooth scroll down Dashboard
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await sleep(3000);
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await sleep(3000);

    // ========================================================
    // SECTION 3: Parametric Budget Studio
    // ========================================================
    console.log('Walkthrough: Section 3 - Parametric Budget Studio');
    await page.keyboard.press('Alt+3');
    await sleep(2500);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await sleep(2000);

    // Showcase dynamic slider rebalancing
    try {
      const rangeSlider = page.locator('input[type="range"]').first();
      if (await rangeSlider.isVisible({ timeout: 2000 })) {
        await rangeSlider.fill('35');
        await sleep(2000);
      }
    } catch (e) {
      console.log('Slider skip:', e.message);
    }

    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await sleep(3000);
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await sleep(3000);

    // ========================================================
    // SECTION 4: Critical Path Timeline & Run of Show Delays
    // ========================================================
    console.log('Walkthrough: Section 4 - Timeline & Run of Show');
    await page.keyboard.press('Alt+4');
    await sleep(2500);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await sleep(2000);

    // Simulate Delay Ripple (+45m HMU Delay)
    try {
      const delay45Btn = page.locator('button:has-text("+45m")').first();
      if (await delay45Btn.isVisible({ timeout: 2000 })) {
        await delay45Btn.click();
        await sleep(3000);
      }
      const delay30Btn = page.locator('button:has-text("+30m")').first();
      if (await delay30Btn.isVisible({ timeout: 2000 })) {
        await delay30Btn.click();
        await sleep(3000);
      }
    } catch (e) {
      console.log('Delay buttons skip:', e.message);
    }

    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await sleep(3000);

    // ========================================================
    // SECTION 5: Vendor Studio & Tranche Management
    // ========================================================
    console.log('Walkthrough: Section 5 - Vendor Studio');
    await page.keyboard.press('Alt+5');
    await sleep(2500);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await sleep(2000);

    // Toggle a checklist item to demonstrate readiness score increase
    try {
      const firstCheckbox = page.locator('input[type="checkbox"]').first();
      if (await firstCheckbox.isVisible({ timeout: 2000 })) {
        await firstCheckbox.click();
        await sleep(2500);
      }
    } catch (e) {
      console.log('Checkbox skip:', e.message);
    }

    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await sleep(3000);

    // ========================================================
    // SECTION 6: GenAI Copilot Studio
    // ========================================================
    console.log('Walkthrough: Section 6 - GenAI Copilot Studio');
    await page.keyboard.press('Alt+6');
    await sleep(2500);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await sleep(2000);

    // Trigger AI Generation
    try {
      const generateAiBtn = page.locator('button:has-text("Execute Copilot & Inspect X-Ray"), button:has-text("Generate")').first();
      if (await generateAiBtn.isVisible({ timeout: 2000 })) {
        await generateAiBtn.click();
        await sleep(4000);
      }
    } catch (e) {
      console.log('AI run skip:', e.message);
    }

    // ========================================================
    // SECTION 7: Prompt X-Ray Drawer
    // ========================================================
    console.log('Walkthrough: Section 7 - Prompt X-Ray Drawer');
    await page.keyboard.press('Alt+X');
    await sleep(4000);

    // Switch between X-Ray tabs if visible
    try {
      const diffTab = page.locator('button:has-text("Dynamic Diff"), button:has-text("Diff")').first();
      if (await diffTab.isVisible({ timeout: 2000 })) {
        await diffTab.click();
        await sleep(2500);
      }
    } catch (e) {
      console.log('Diff tab skip:', e.message);
    }

    // Close Prompt X-Ray Drawer
    await page.keyboard.press('Alt+X');
    await sleep(2000);

    // ========================================================
    // SECTION 8: Google Workspace Hub Modal
    // ========================================================
    console.log('Walkthrough: Section 8 - Google Workspace Hub Modal');
    try {
      const hubBtn = page.locator('button:has-text("Google Workspace Hub")').first();
      if (await hubBtn.isVisible({ timeout: 2000 })) {
        await hubBtn.click();
        await sleep(3500);

        // Close modal
        const closeBtn = page.locator('div[role="dialog"] button').first();
        if (await closeBtn.isVisible({ timeout: 2000 })) {
          await closeBtn.click();
          await sleep(2000);
        }
      }
    } catch (e) {
      console.log('Workspace Hub skip:', e.message);
    }

    // Final smooth scroll to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await sleep(3000);

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
      console.log(`Copied video to canonical destination: ${targetName}`);
      const stats = fs.statSync(targetName);
      console.log(`Video file size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
    }
  }
}

runWalkthrough().catch(console.error);
