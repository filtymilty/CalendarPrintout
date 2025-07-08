// Simple in-browser storage adapter using localStorage
const StorageAdapter = {
    load() {
        const raw = localStorage.getItem('calendars');
        if (!raw) return [];
        try {
            return JSON.parse(raw);
        } catch (e) {
            console.error('Failed to parse calendars from storage', e);
            return [];
        }
    },
    save(calendars) {
        localStorage.setItem('calendars', JSON.stringify(calendars));
    }
};

// Calendar manager keeps calendars in memory and delegates persistence
const CalendarManager = (function(adapter) {
    let calendars = [];

    function loadCalendars() {
        calendars = adapter.load();
        return calendars;
    }

    function saveCalendars() {
        adapter.save(calendars);
    }

    function createCalendar(name) {
        const id = Date.now().toString();
        const calendar = { id, name, lists: [] };
        calendars.push(calendar);
        saveCalendars();
        return calendar;
    }

    function deleteCalendar(id) {
        const index = calendars.findIndex(c => c.id === id);
        if (index !== -1) {
            calendars.splice(index, 1);
            saveCalendars();
            return true;
        }
        return false;
    }

    function getCalendars() {
        return calendars.slice();
    }

    return { loadCalendars, saveCalendars, createCalendar, deleteCalendar, getCalendars };
})(StorageAdapter);

// Basic UI rendering for now
function renderCalendarList() {
    const listEl = document.getElementById('calendar-list');
    const calendars = CalendarManager.getCalendars();
    if (calendars.length === 0) {
        listEl.innerHTML = '<li>No calendars yet</li>';
        return;
    }
    listEl.innerHTML = '';
    calendars.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c.name;
        listEl.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    CalendarManager.loadCalendars();
    renderCalendarList();
});

// Expose for use elsewhere
window.CalendarManager = CalendarManager;
