# **Under-4-Minute Demo Video Director's Script, Live Test Data Cheat Sheet & Submission Checklist**

**Document ID:** 09\_Under\_4\_Minute\_Demo\_Video\_Script\_Live\_Test\_Data\_and\_Submission\_Checklist  
**Parent Folder:** [Promptwars \- Challenge 5](https://drive.google.com/drive/folders/1_X0KYzGtE3KIC3PJVvHtiW4JfhCmILt5)  
**Target Video Duration:** `3 minutes 40 seconds` (Strictly under the 4:00 limit)

# **1\. How This Script Maps 100% to the PromptWars Video Submission Guide**

| Video Guide Section | Time Window | What Judges Look For | Exact On-Screen Action in AuraPlan AI |
| :---- | :---- | :---- | :---- |
| **1\. Clear Walkthrough** | `0:00 – 0:50` (50s) | Natural flow from onboarding to core features (Weddings, Birthdays, Community Events, Budgets, Timelines, Vendors, Ideas) | Start at **Step 1 (Onboarding)** \-\> Walk sequentially through **Step 2 (Dashboard)** \-\> **Step 3 (Budget Studio)** \-\> **Step 4 (Timeline & Run-of-Show)** \-\> **Step 5 (Vendor Checklist)** \-\> **Step 6 (GenAI Studio)**. |
| **2\. Live Testing (Valid vs Invalid & Edge Cases)** | `0:50 – 1:50` (60s) | Enter data live (not pre-filled); pause so exact values (`john@example.com`) are readable; show success and error/edge cases | Open the **Live Testing & Validation Inspector Bar**. Type invalid email (`john@invalid`), pause 2s \-\> fix to `john@example.com`, pause 2s \-\> test negative budget (`-15000`) \-\> test **500-guest Per-Capita Deficit edge case** (`₹25,000` for 500 guests) \-\> fix to `₹8,50,000`. |
| **3\. GenAI in Action & Dynamic Proof** | `1:50 – 3:05` (75s) | Point out where AI is used; show prompt going in and response coming out; explain purpose; prove responses change dynamically based on input | Open **Step 6 (GenAI Studio)** \+ **Live Prompt X-Ray Drawer**. Run **Generation \#1** (*250-Guest Royal South Indian Wedding*). Show prompt in & JSON response out. Change inputs live to **Generation \#2** (*400-Attendee Neon Cyberpunk College Hackathon*) and open the **Dynamic Mutation Diff Tab** proving 100% dynamic changes. |
| **4, 5 & 6\. Crisis Sim, Export & Wrap-Up** | `3:05 – 3:40` (35s) | Step-by-step clarity, under 4 minutes, ready for public Drive / YouTube incognito check | Trigger **\+45m Caterer Delay / Rain Crisis Simulator** on the Timeline, click **Export Event Dossier**, and conclude cleanly at `3:40`. |

# **2\. Second-by-Second Recording Script & Live Typing Cheat Sheet**

## **Segment 1: Onboarding & Live Input Testing (`0:00 – 1:50`)**

1. **`0:00 – 0:15` (Intro & Clean Slate):**  
   * Start on **Step 1: Setup & Live Validation** with the **Live Testing & Validation Inspector Bar** visible at the top (browser zoom set to `110%` for crystal-clear readability).  
   * *Optional Voiceover / On-Screen Caption:* `"Welcome to AuraPlan AI (UtsavOS) — our GenAI-powered Celebration & Event Planning Operating System for Weddings, Birthdays, and Community Events."`  
2. **`0:15 – 0:45` (Live Testing — Email & Past Date Edge Cases):**  
   * Click into **Organizer Name** and type live: `Arikaran P`  
   * Click into **Organizer Email** and type an **invalid email first**: `john@invalid`  
   * **PAUSE 2 FULL SECONDS** so judges clearly read the red validation banner: `✗ INVALID EMAIL: "john@invalid" — Email domain must include a valid TLD (.com, .org, .in)`.  
   * Clear the field and type live: `john@example.com`  
   * **PAUSE 2 FULL SECONDS** on the green badge: `✓ VALID RFC-5322 EMAIL: "john@example.com" Verified`.  
   * In **Event Date**, select a past date (`2024-05-10`) and pause 2 seconds to show: `✗ Event date cannot be in the past`. Then select a valid future date: `2026-12-18`.  
3. **`0:45 – 1:25` (Live Testing — Negative Budget & Per-Capita Deficit Domain Edge Case):**  
   * Select Event Archetype: **Wedding & Ceremonies** (`South Indian Multi-Day Wedding`).  
   * Type Event Title live: `Priya & Karthik Royal Heritage Wedding`  
   * Type **Guest Count**: `500`  
   * Type an **invalid negative budget**: `-15000` \-\> Pause 2 seconds on the red error (`✗ Total budget must be greater than 0`).  
   * Now type an **unrealistic low budget edge case**: `25000` (₹25,000 for 500 guests \= ₹50/guest).  
   * **PAUSE 3 SECONDS** on the **Critical Per-Capita Deficit Alert Banner**: `"⚠ CRITICAL DEFICIT: ₹50/guest is 92% below the ₹650/guest minimum viable floor for a 500-guest Wedding."`  
4. **`1:25 – 1:50` (Valid Submission & Walkthrough of Core Modules):**  
   * Update **Guest Count** to `250` and **Total Budget** to `850000` (₹8,50,000).  
   * Pause 2 seconds on the green `OPTIMAL FEASIBILITY (₹3,400/guest)` badge and click **"Generate Complete Event Blueprint"**.

## **Segment 2: Core Walkthrough — Dashboard, Budget Studio, Timeline & Vendors (`1:50 – 2:25`)**

1. **`1:50 – 2:02` (Step 2 & Step 3 — Dashboard & 60 FPS Budget Studio):**  
   * Show the 4 Hero KPI cards (`₹8,50,000 Total`, `₹68,000 Contingency Reserve`, `₹71,091 Tax Reserve`, `₹7,10,909 Net Allocatable`).  
   * In **Budget Studio**, click the **Lock icon** on `Venue & Mandapam` and drag the `Catering & F&B` slider to show real-time `<16ms` proportional rebalancing across the other 10 categories.  
2. **`2:02 – 2:15` (Step 4 — CPM Timeline & Live Delay Simulator):**  
   * Open **Step 4: Timeline & Run-of-Show**. Show the Countdown Milestones (`T-60d` to `T-1d`) and switch to **Minute-by-Minute Run-of-Show**.  
   * Click **"+45 Min Caterer Delay"** to show dependent timeline slots automatically ripple-shifting while absorbing slack buffers.  
3. **`2:15 – 2:25` (Step 5 — 12-Category Vendor Checklist & Tranche Guardrail):**  
   * Open **Step 5: Vendor Checklist**. Check off items to watch the **Vendor Readiness Score** climb, and test entering a `70% Advance` to trigger the `⚠ High Advance Risk (>50%)` warning before setting it to `30% Advance / 50% Event Day / 20% Holdback`.

## **Segment 3: GenAI in Action, Live Prompt X-Ray & Dynamic Mutation Proof (`2:25 – 3:40`)**

1. **`2:25 – 2:55` (GenAI Run \#1 — Live Prompt Going In & Structured Response Coming Out):**  
   * Click **Step 6: GenAI Personalization Studio** and open the **Split-Screen Live Prompt X-Ray Drawer**.  
   * Point cursor at the **"Why GenAI Is Used Here"** banner and type custom prompt live:  
     `Eco-friendly Chettinad floral decor with brass lamps, zero plastic, and traditional banana leaf feast including 40 Jain-safe and 15 nut-free meals`  
   * Click **"Run Gemini 2.5 Flash Copilot"**.  
   * **PAUSE 3 SECONDS** on the split screen so judges clearly see:  
     * **Left Pane:** The exact structured prompt \+ budget caps (`Catering Cap: ₹2,13,273`, `Decor Cap: ₹99,527`) sent into Gemini.  
     * **Right Pane:** The live JSON response coming out (`Theme Palette`, `Decor BOM costs`, `Jain/Nut-Free Menu Quantities in kg`, and `Vendor RFP Script`).  
2. **`2:55 – 3:30` (Proving GenAI Is 100% Dynamic — Run \#2 & Side-by-Side Diff Inspector):**  
   * Switch Event Archetype at the top to **Community Event / College Fest** (`Inter-College AI Hackathon & Cultural Night`), set **Guest Count \= 400**, **Total Budget \= 150000** (₹1.5L), and type prompt live:  
     `High-energy cyberpunk stage setup with LED wall, late-night coffee & vegan snack stations, and sponsor stall layout`  
   * Click **"Run Gemini 2.5 Flash Copilot (Run \#2)"**.  
   * Click the **"Dynamic Proof: Compare Run \#1 vs Run \#2"** tab and **PAUSE 4 SECONDS**:  
     * Show the highlighted side-by-side comparison proving how changing the archetype, budget, and prompt completely mutated the color hex codes, stage BOM, food quantities (`250 wedding guests -> 400 hackathon attendees`), and vendor checklist priorities.  
3. **`3:30 – 3:40` (Export & Clean Finish):**  
   * Click **"Export Event Blueprint Dossier"** to download the complete plan and stop recording at `3:40`.

# **3\. Pre-Submission Final Verification Checklist**

- [ ] **Deployed Link Check:** Open the production URL in an Incognito window; verify all 6 steps and live AI generation work with zero console errors.  
- [ ] **GitHub Repository Check:** Confirm repository is **Public**, `.env` is gitignored, `.env.example` and `README.md` are present at root, and `npm run test` passes 100%.  
- [ ] **Video Length Check:** Confirm video duration is `< 4:00` (target `3:35–3:45`).  
- [ ] **Incognito Video Link Check:** Upload video to Google Drive (`Anyone with the link can view`) or YouTube (`Unlisted`) and open the URL in an Incognito browser window to confirm instant playback without login prompts.

