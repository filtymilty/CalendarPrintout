# Calendar Generator

This repository contains the initial planning for a lightweight calendar generator. The goal is a simple web application that can eventually be packaged as a standalone download.

## Goals

- Build a static application that works without a server.
- Use local browser storage for now but design for future use of local data files ("Calendars") that can be shared between users.
- Allow creating named lists of dates with both standalone and recurring events.
- Provide a calendar view for selecting a month/year and printing a grayscale calendar with events.

## Planned Features

1. **Calendar Management**
   - Multiple calendars saved locally (later via data files).
   - Create, rename, delete, and share calendars.

2. **Event Lists**
   - Each calendar contains lists of events.
   - Events can be **Standalone** (single date) or **Recurring** (rules such as daily, weekly, monthly, yearly, etc.).
   - Support advanced recurring rules through a "Variable" option for complex holiday logic.

3. **Calendar View & Printout**
   - Simple month view starting on Sundays.
   - Weekends shaded differently.
   - Handles months requiring a partial sixth row with half-height days.
   - Printable layout in grayscale with month and year header.

4. **Storage & Future Packaging**
   - Initially store calendars in `localStorage` during development.
   - Design data structures that map easily to files for a future packaged app.

## Initial Task List

1. Set up basic HTML/CSS/JS scaffold without a framework.
2. Implement calendar rendering logic for a given month/year.
3. Create UI for adding and managing event lists (standalone and recurring).
4. Persist calendars in local storage.
5. Add print styles for calendar pages.
6. Outline data file format for eventual packaging.

This README and plan are the starting point for the project. Further tasks will evolve as features are implemented.
