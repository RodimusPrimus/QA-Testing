function loadEvents() {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    return events.map(e => ({...e, date: new Date(e.date)}));
}

function saveEvents(events) {
    localStorage.setItem('events', JSON.stringify(events));
}

function renderEvents(events) {
    const list = document.getElementById('event-list');
    list.innerHTML = '';
    events.forEach((event, index) => {
        const li = document.createElement('li');
        li.textContent = `${event.title} - ${event.date.toLocaleString()} (reminder: ${event.reminder || 0}m)`;
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = () => {
            events.splice(index, 1);
            saveEvents(events);
            renderEvents(events);
        };
        li.appendChild(delBtn);
        list.appendChild(li);
    });
}

function scheduleReminders(events) {
    events.forEach(event => {
        if (event.reminder && !event.reminded) {
            const reminderTime = new Date(event.date.getTime() - event.reminder * 60000);
            const delay = reminderTime - Date.now();
            if (delay > 0) {
                setTimeout(() => {
                    alert(`Reminder: ${event.title} at ${event.date.toLocaleString()}`);
                    event.reminded = true;
                    saveEvents(events);
                }, delay);
            }
        }
    });
}

document.getElementById('event-form').addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const datetime = document.getElementById('datetime').value;
    const reminder = parseInt(document.getElementById('reminder').value, 10);
    const events = loadEvents();
    events.push({ title, date: new Date(datetime).toISOString(), reminder: isNaN(reminder) ? null : reminder });
    saveEvents(events);
    renderEvents(events);
    scheduleReminders(events);
    e.target.reset();
});

const events = loadEvents();
renderEvents(events);
scheduleReminders(events);
