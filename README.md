# Calendar Generator

A lightweight web-based calendar builder that can eventually be packaged as a standalone download. The goal is to keep the framework extremely simple while supporting rich recurring events and printable calendars.

## Goals

- **Minimal setup:** plain HTML, CSS, and JavaScript without a heavy framework.
- **Local persistence:** use `localStorage` during development but design data structures that map directly to shareable calendar files.
- **Multiple calendars:** each "Calendar" file holds its own lists of events and print settings.
- **Event lists:** allow standalone dates or recurring schedules with a variety of rules.
- **Printable calendars:** select a month and year, render a grayscale month view, and print.

## Core Screens

1. **Calendar Selection**
   - Create, rename, delete, and share calendars (no duplicate names).
   - Loading a calendar loads all of its saved lists and print options.

2. **Event List Manager**
   - Display all lists for the active calendar.
   - Each list shows its name and whether it is *Standalone*, a basic recurrence (daily, weekly, bi-weekly, monthly, quarterly, yearly), or a *Variable* recurrence with custom rules.
   - A plus sign lets users add a new list, prompting for the list name and recurrence type.
   - Within a list, each item has a title and start date (first occurrence for recurring).

3. **Calendar Preview & Print**
   - Choose a month and year to view.
   - Month grid starts on Sunday with Saturday and Sunday lightly shaded.
   - If a sixth row of days is required, the final row uses half-height cells.
   - Header shows the month and year (e.g., "July 2025").
   - Designed for a clean grayscale printout.

## Storage & Packaging

- Initially all data is stored in the browser using `localStorage`.
- Calendars are structured so the same data can be saved to individual files in a packaged app.
- When packaged, sharing a calendar means sharing its corresponding file.
- Print layout options are stored alongside event data within each calendar.

## Planned Feature Highlights

- Full set of recurrence options including "Variable" rules for complex holidays.
- Support for multiple named calendars with independent lists.
- Simple build or bundling script if needed, but no large framework.
- Potential expansion to serverless functions or database storage later, but not required now.

## Initial Task List

- [ ] Set up basic HTML, CSS, and JavaScript scaffold.
- [ ] Build UI for creating and managing calendars and lists.
- [ ] Implement recurring rule logic and date calculations.
- [ ] Render monthly calendar view with weekend shading and half-height sixth row when needed.
- [ ] Persist data to `localStorage` while mirroring the planned file format.
- [ ] Add print-friendly styles.
- [ ] Document the data file structure for future packaged releases.

This repository will evolve as features are implemented. Contributions and issue reports are welcome.
