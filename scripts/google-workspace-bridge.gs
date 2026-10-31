// scripts/google-workspace-bridge.gs
/**
 * AuraPlan AI (UtsavOS) — Production Google Apps Script Web App Bridge
 * Deploy as Web App (Execute as: Me, Access: Anyone).
 */
function doPost(e: any) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const { eventName, eventDate, city, currency, totalBudget, guestCount, allocations, milestones, vendors } = payload;

    // 1. Construct Google Sheets Master Workbook (3 Worksheets)
    const ss = SpreadsheetApp.create(`AuraPlan OS — ${eventName} (${city}) Master Sheet`);

    // Worksheet A: Budget Breakdown
    const budgetSheet = ss.getActiveSheet().setName('Budget_Breakdown');
    budgetSheet.appendRow(['Category', 'Allocated %', `Amount (${currency})`, 'Per Guest', 'Status']);
    allocations.forEach((item: any) => {
      budgetSheet.appendRow([item.label, `${item.percent}%`, item.amount, Math.round(item.amount / guestCount), item.locked ? 'LOCKED' : 'DYNAMIC']);
    });

    // Worksheet B: Vendor 30/50/20 Ledger
    const vendorSheet = ss.insertSheet('Vendor_30_50_20_Ledger');
    vendorSheet.appendRow(['Vendor Category', 'Total SLA', '30% Advance', '50% Event Day', '20% Holdback', 'Verification Status']);
    vendors.forEach((v: any) => {
      vendorSheet.appendRow([v.category, v.totalAmount, v.advance30, v.eventDay50, v.holdback20, `${v.completedChecks}/10 Verified`]);
    });

    // 2. Construct Master Executive Dossier in Google Docs
    const doc = DocumentApp.create(`AuraPlan OS — ${eventName} Executive Dossier`);
    const body = doc.getBody();
    body.appendParagraph(`AURAPLAN AI — MASTER EVENT DOSSIER: ${eventName.toUpperCase()}`)
        .setHeading(DocumentApp.ParagraphHeading.HEADING1);
    body.appendParagraph(`Location: ${city} | Target Date: ${eventDate} | Guests: ${guestCount} | Total Budget: ${currency} ${totalBudget}`);
    body.appendParagraph('Critical Path Milestones').setHeading(DocumentApp.ParagraphHeading.HEADING2);
    milestones.forEach((m: any) => body.appendListItem(`[${m.offsetLabel}] ${m.title} — ${m.owner} (${m.scheduledDate})`));
    doc.saveAndClose();

    // 3. Construct Official Guest RSVP Form
    const form = FormApp.create(`${eventName} — Official Guest RSVP & Dietary Preferences`);
    form.addTextItem().setTitle('Full Name').setRequired(true);
    form.addMultipleChoiceItem().setTitle('Attendance Confirmation')
        .setChoiceValues(['Yes, Attending in Person', 'Regretfully Declining']).setRequired(true);
    form.addCheckboxItem().setTitle('Dietary & Cultural Meal Preferences')
        .setChoiceValues(['Standard Vegetarian', 'Jain (No Root Vegetables)', 'Vegan', 'Gluten-Free / Nut Allergy', 'Non-Vegetarian']);
    form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      spreadsheetUrl: ss.getUrl(),
      documentUrl: doc.getUrl(),
      formPublishUrl: form.getPublishedUrl(),
      formEditUrl: form.getEditUrl(),
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
