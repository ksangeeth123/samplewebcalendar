const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDay = null;
let tasks = {};

function calculateFullMoonDates(year) {
    const fullMoonDates = [];
    
    const knownFullMoon = new Date(Date.UTC(2023, 0, 6, 23, 8)); 
    const synodicMonth = 29.53058867 * 24 * 60 * 60 * 1000; 
    
    let currentFullMoon = new Date(knownFullMoon);
    
    while (currentFullMoon.getUTCFullYear() < year) {
        currentFullMoon = new Date(currentFullMoon.getTime() + synodicMonth);
    }
    
    while (currentFullMoon.getUTCFullYear() === year) {
        fullMoonDates.push(new Date(currentFullMoon)); 
        currentFullMoon = new Date(currentFullMoon.getTime() + synodicMonth);
    }
    
    return fullMoonDates;
}

function calculatePoyaDays(year) {
    const poyaDays = {};
    const fullMoonDates = calculateFullMoonDates(year);
    const poyaNames = [
        "Duruthu Full Moon Poya Day",
        "Navam Full Moon Poya Day",
        "Madin Full Moon Poya Day",
        "Bak Full Moon Poya Day",
        "Vesak Full Moon Poya Day",
        "Day following Vesak Full Moon Poya Day",
        "Poson Full Moon Poya Day",
        "Esala Full Moon Poya Day",
        "Nikini Full Moon Poya Day",
        "Binara Full Moon Poya Day",
        "Vap Full Moon Poya Day",
        "Ill Full Moon Poya Day",
        "Unduvap Full Moon Poya Day"
    ];

    fullMoonDates.forEach((date, index) => {
        if (index < poyaNames.length) {
            const formattedDate = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
            poyaDays[formattedDate] = poyaNames[index];
        }
    });

    return poyaDays;
}

const poyaDays = {};
for (let year = 2024; year <= 2058; year++) {
    poyaDays[year] = calculatePoyaDays(year);
}

function updateCalendar() {
    const calendarTitle = document.getElementById('calendarTitle');
    const calendarDays = document.getElementById('calendarDays');
    calendarTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    calendarDays.innerHTML = '';

    const fullMoonDates = poyaDays[currentYear] || {};
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calendarDays.innerHTML += '<div class="calendar-day"></div>';
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const day = new Date(currentYear, currentMonth, i).getDay();
        const dayClass = day === 6 ? 'saturday' : day === 0 ? 'sunday' : 'other';

        const key = `${currentYear}-${currentMonth + 1}-${i}`;
        const taskList = tasks[key] || [];
        const taskListHTML = taskList.map((task, index) => `
            <div class="task">
                <span>${task}</span>
                <button class="remove-task" onclick="removeTask(${i}, ${index})">❌</button>
            </div>
        `).join('');

        const poyaDayName = fullMoonDates[key];
        const fullMoonClass = poyaDayName ? 'full-moon' : '';

        calendarDays.innerHTML += `<div class="calendar-day ${dayClass} ${fullMoonClass}" data-day="${i}" title="${poyaDayName || ''}" onclick="selectDay(${i})">
            ${i}
            <div class="task-list" id="task-list-${i}">${taskListHTML}</div>
        </div>`;
    }
}

function changeMonth(step) {
    currentMonth += step;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear -= 1;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear += 1;
    }
    updateCalendar();
}

function changeYear(step) {
    currentYear += step;
    updateCalendar();
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const task = taskInput.value.trim();
    if (!task || !selectedDay) return;

    const key = `${currentYear}-${currentMonth + 1}-${selectedDay}`;
    if (!tasks[key]) {
        tasks[key] = [];
    }

    tasks[key].push(task);
    taskInput.value = '';
    updateCalendar();
}

function removeTask(day, taskIndex) {
    const key = `${currentYear}-${currentMonth + 1}-${day}`;
    if (tasks[key]) {
        tasks[key].splice(taskIndex, 1);
    }
    updateCalendar();
}

function selectDay(day) {
    selectedDay = day;
    document.querySelectorAll('.calendar-day').forEach(dayEl => {
        dayEl.classList.remove('selected');
    });
    const selectedDayEl = document.querySelector(`[data-day="${day}"]`);
    if (selectedDayEl) {
        selectedDayEl.classList.add('selected');
    }
}

updateCalendar();
