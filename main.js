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

    function getCalendar(id) {
        return calendars.find(c => c.id === id);
    }

    function addList(calendarId, name, type) {
        const cal = getCalendar(calendarId);
        if (!cal) return null;
        const list = { id: Date.now().toString(), name, type, items: [] };
        cal.lists.push(list);
        saveCalendars();
        return list;
    }

    function updateList(calendarId, listId, data) {
        const cal = getCalendar(calendarId);
        if (!cal) return false;
        const list = cal.lists.find(l => l.id === listId);
        if (!list) return false;
        if (data.name !== undefined) list.name = data.name;
        if (data.type !== undefined) list.type = data.type;
        saveCalendars();
        return true;
    }

    function deleteList(calendarId, listId) {
        const cal = getCalendar(calendarId);
        if (!cal) return false;
        const idx = cal.lists.findIndex(l => l.id === listId);
        if (idx === -1) return false;
        cal.lists.splice(idx, 1);
        saveCalendars();
        return true;
    }

    function addItem(calendarId, listId, data) {
        const cal = getCalendar(calendarId);
        if (!cal) return null;
        const list = cal.lists.find(l => l.id === listId);
        if (!list) return null;
        const item = { id: Date.now().toString(), title: data.title, date: data.date };
        list.items.push(item);
        saveCalendars();
        return item;
    }

    function updateItem(calendarId, listId, itemId, data) {
        const cal = getCalendar(calendarId);
        const list = cal && cal.lists.find(l => l.id === listId);
        const item = list && list.items.find(i => i.id === itemId);
        if (!item) return false;
        if (data.title !== undefined) item.title = data.title;
        if (data.date !== undefined) item.date = data.date;
        saveCalendars();
        return true;
    }

    function deleteItem(calendarId, listId, itemId) {
        const cal = getCalendar(calendarId);
        const list = cal && cal.lists.find(l => l.id === listId);
        if (!list) return false;
        const idx = list.items.findIndex(i => i.id === itemId);
        if (idx === -1) return false;
        list.items.splice(idx, 1);
        saveCalendars();
        return true;
    }

    return {
        loadCalendars,
        saveCalendars,
        createCalendar,
        deleteCalendar,
        getCalendars,
        getCalendar,
        addList,
        updateList,
        deleteList,
        addItem,
        updateItem,
        deleteItem
    };
})(StorageAdapter);

// Basic UI rendering for now
function renderCalendarList() {
    const listEl = document.getElementById('calendar-list');
    const menuEl = document.getElementById('main-menu');

    let addBtn = document.getElementById('add-calendar-btn');
    if (!addBtn) {
        addBtn = document.createElement('button');
        addBtn.id = 'add-calendar-btn';
        addBtn.textContent = 'Add Calendar';
        addBtn.addEventListener('click', () => {
            const name = prompt('Calendar name?');
            if (name) {
                CalendarManager.createCalendar(name);
                renderCalendarList();
            }
        });
        menuEl.insertBefore(addBtn, listEl);
    }

    const calendars = CalendarManager.getCalendars();
    if (calendars.length === 0) {
        listEl.innerHTML = '<li>No calendars yet</li>';
        return;
    }
    listEl.innerHTML = '';
    calendars.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c.name;
        li.addEventListener('click', () => {
            renderInputsView(c.id);
        });
        listEl.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    CalendarManager.loadCalendars();
    renderCalendarList();
});

// Expose for use elsewhere
window.CalendarManager = CalendarManager;

function renderInputsView(calendarId) {
    const app = document.getElementById('app');
    const calendar = CalendarManager.getCalendar(calendarId);
    if (!calendar) {
        app.textContent = 'Calendar not found';
        return;
    }

    const container = document.createElement('div');
    const header = document.createElement('h2');
    header.textContent = `${calendar.name} - Lists`;
    container.appendChild(header);

    const backBtn = document.createElement('button');
    backBtn.textContent = 'Back';
    backBtn.addEventListener('click', () => {
        app.innerHTML = '';
        renderCalendarList();
    });
    container.appendChild(backBtn);

    const listsWrapper = document.createElement('div');
    container.appendChild(listsWrapper);

    const addListBtn = document.createElement('button');
    addListBtn.textContent = 'Add List';
    addListBtn.addEventListener('click', () => {
        const name = prompt('List name?');
        if (!name) return;
        const type = prompt('Type (Standalone, Recurring, Variable)?', 'Standalone');
        CalendarManager.addList(calendar.id, name, type || 'Standalone');
        renderInputsView(calendar.id);
    });
    container.appendChild(addListBtn);

    calendar.lists.forEach(list => {
        const listDiv = document.createElement('div');
        listDiv.className = 'list-block';
        const title = document.createElement('h3');
        title.textContent = `${list.name} (${list.type})`;
        listDiv.appendChild(title);

        const editListBtn = document.createElement('button');
        editListBtn.textContent = 'Edit List';
        editListBtn.addEventListener('click', () => {
            const newName = prompt('List name', list.name);
            if (!newName) return;
            const newType = prompt('Type', list.type);
            CalendarManager.updateList(calendar.id, list.id, { name: newName, type: newType || list.type });
            renderInputsView(calendar.id);
        });
        listDiv.appendChild(editListBtn);

        const delListBtn = document.createElement('button');
        delListBtn.textContent = 'Delete List';
        delListBtn.addEventListener('click', () => {
            if (confirm('Delete this list?')) {
                CalendarManager.deleteList(calendar.id, list.id);
                renderInputsView(calendar.id);
            }
        });
        listDiv.appendChild(delListBtn);

        const itemsUl = document.createElement('ul');
        list.items.forEach(item => {
            const itemLi = document.createElement('li');
            itemLi.textContent = `${item.title} - ${item.date}`;

            const editItemBtn = document.createElement('button');
            editItemBtn.textContent = 'Edit';
            editItemBtn.addEventListener('click', () => {
                const newTitle = prompt('Item title', item.title);
                if (!newTitle) return;
                const newDate = prompt('Date', item.date);
                CalendarManager.updateItem(calendar.id, list.id, item.id, { title: newTitle, date: newDate });
                renderInputsView(calendar.id);
            });
            itemLi.appendChild(editItemBtn);

            const delItemBtn = document.createElement('button');
            delItemBtn.textContent = 'Delete';
            delItemBtn.addEventListener('click', () => {
                if (confirm('Delete item?')) {
                    CalendarManager.deleteItem(calendar.id, list.id, item.id);
                    renderInputsView(calendar.id);
                }
            });
            itemLi.appendChild(delItemBtn);

            itemsUl.appendChild(itemLi);
        });
        listDiv.appendChild(itemsUl);

        const addItemBtn = document.createElement('button');
        addItemBtn.textContent = 'Add Item';
        addItemBtn.addEventListener('click', () => {
            const title = prompt('Item title?');
            if (!title) return;
            const date = prompt('Date (YYYY-MM-DD)');
            CalendarManager.addItem(calendar.id, list.id, { title, date });
            renderInputsView(calendar.id);
        });
        listDiv.appendChild(addItemBtn);

        listsWrapper.appendChild(listDiv);
    });

    app.innerHTML = '';
    app.appendChild(container);
}
