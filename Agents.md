# Project: Standalone Calendar Generator

## Overview

This project is a simple static calendar generator app with two core parts:

- An **inputs screen** where users can create lists of events (either standalone dates or recurring ones).
- A **calendar view screen** where users can pick a month and year to view and print a grayscale calendar layout that includes their events.

The whole thing is meant to stay really lightweight. No server, just a browser-based app. We’ll use localStorage for testing (and for Vercel test deploys), but the longer-term goal is for this to be downloadable as a self-contained app where each calendar lives as a separate file the user can save, load, and share.

We’re not looking to overengineer this — plain JavaScript, maybe a small helper library like `date-fns` or `day.js`, no big frameworks. Keep the architecture simple and focused on clarity and portability.

This doc isn’t trying to define the whole project exhaustively — it’s more of a general direction and shared memory for AI agents doing the work. Add things here as they come up. Keep it human, keep it helpful.

---

## How It Should Work (So Far)

### Main Menu

- Shows all "Calendars" saved by the user (these are full sets of lists and events).
- Options to create, rename, delete, import, or export calendars.
- Calendar names should be unique.
- Each calendar has its own saved formatting settings and lists.

### Inputs Screen (per calendar)

Lists are shown here. Each list has:

- A name
- A schedule type: **Standalone**, **Recurring**, or **Variable** (each item can have custom recurring rules)

Each list contains items. Each item has:

- A title
- A date (or first occurrence for recurring, or custom ruleset for variable)

To add a new list:

- Prompt for name and schedule type
- Based on type, either let the user just pick a date per item or build out recurrence rules

### Calendar View

Lets user select any month and year to view.

Renders a printable calendar with:

- Month and year as header (e.g., "July 2025")
- Weeks starting on Sunday
- Slight shading on weekends (Sat/Sun)
- Half-height final row if the month runs into a sixth row (rare, like 31st overflow)
- Each day box just shows the number in the top-left

Nothing fancy here — just a clean grayscale layout that can later be printed. We will improve this later.

---

## Recurrence

### Simple Recurrences

Let’s cover common types and have them selectable as a list type:

- Daily
- Weekdays
- Weekly
- Bi-weekly
- Monthly
- Quarterly
- Bi-yearly
- Yearly

### Variable Recurrence

Some holidays and events follow weird patterns, like "Last Thursday of the month" or "First Monday after the 15th." That’s where **Variable** comes in.

These lists let each item define its own custom recurrence logic. You won’t be choosing just a start date — you’ll be setting up rule logic directly for each item. This section will need a bit more complex UI, but it’ll be powerful once it’s in.

---

## Data Persistence

### For Testing / Vercel

Use `localStorage` to keep everything persistent:

- All calendars and their names
- Lists and their contents
- Recurrence info
- Print settings

### For Final Packaged Version

- Each calendar will become a `.json` file
- One file contains:
  - Event lists
  - Recurrence rules
  - Formatting settings
- App can load/save/export these calendars so users can share or back them up

Eventually we’ll swap out the localStorage code for a file system-based approach so try to keep that transition in mind. The app will be a packaged downloadable and the Calendar files will be stored in a folder where the program file is stored when downloaded, but they will be interacted with through the app (creating, renaming, deleting). Haven't quite figured out sharing yet but basically it will be just sending a copy of the Calendar file to somebody else.

---

## Print Settings

### For now:

- Grayscale only
- Slight shading for weekends
- Clean layout, no fancy styles
- Saved per calendar (so different calendars can have different formats later)

### Later:

- Maybe add controls for margins, font sizes, spacing, etc.

---

## Ongoing Development Notes

This doc is evolving alongside the app. If you (as an AI agent) figure out better ways to structure recurrence, simplify the UI, or anything else — suggest it to the user. Just keep things in line with the minimal and static-first nature of the app.

Try to avoid complicating the code with frameworks or libraries unless it makes something significantly easier. Don’t reach for React or Vue. Think long-term maintainability and packaging.
