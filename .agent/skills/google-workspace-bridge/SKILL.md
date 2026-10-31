---
name: google-workspace-bridge
description: Guidance and URI templates for Tier-1 Zero-Auth Google Workspace deep links and Tier-2 Apps Script webhook payloads.
---

# Google Workspace Bridge Skill

Use this skill when constructing deep links or webhook payloads for Google Calendar, Gmail, Google Sheets, Google Docs, and Google Forms.

## Tier-1 Zero-Auth Deep Link Patterns:
- Google Calendar:
  `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDateIso}/${endDateIso}`
- Gmail Compose:
  `https://mail.google.com/mail/?view=cm&fs=1&to=${vendorEmail}&su=${subject}&body=${body}`
- Google Maps Search & Directions:
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`

## Tier-2 Webhook Payload Structure:
Must match `WorkspaceSyncPayload` interface: `{ eventName, eventDate, city, currency, totalBudget, guestCount, allocations, milestones, vendors }`.
