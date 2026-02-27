document.addEventListener('DOMContentLoaded', async () => {

    await loadComponents();

    // Activar link activo del navbar
    document.querySelectorAll('.nav-link').forEach(link =>
        link.href.endsWith(location.pathname.split('/').pop() || 'index.html') &&
        link.classList.add('active')
    );

    // Render dinámico según la página
    if (document.getElementById('history-container')) {
        renderHistory();
    }

    if (document.getElementById('coaches-container')) {
        renderCoaches();
    }

    if (document.getElementById('classes-container')) {
        renderClasses();
    }

    if (document.getElementById('schedule-container')) {
        renderSchedule();
    }
});

async function loadComponents() {

    const loadHTML = async (elementId, filePath) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        const response = await fetch(filePath);
        element.innerHTML = await response.text();
    };

    await loadHTML('header-placeholder', 'components/header.html');
    await loadHTML('footer-placeholder', 'components/footer.html');
}

/* ======================
   HISTORIA
====================== */
function renderHistory() {

    const element = document.getElementById('history-container');
    if (!element || !window.dojoHistory) return;

    element.innerHTML = window.dojoHistory.map(item => {

        return `
            <div class="timeline-item mb-4">
                <img src="${item.image}" 
                     class="img-fluid rounded mb-3 shadow-sm w-100"
                     style="max-height:400px; object-fit:cover;">

                <div class="infocontainer p-4 bg-white rounded shadow-sm">
                    <div class="timeline-year">${item.year}</div>
                    <h4 class="timeline-title">${item.title}</h4>
                    <p class="timeline-desc">${item.description}</p>
                </div>
            </div>
        `;
    }).join("");
}

/* ======================
   COACHES
====================== */
function renderCoaches() {

    const element = document.getElementById('coaches-container');
    if (!element || !window.dojoCoaches) return;

    element.innerHTML = window.dojoCoaches.map(coach => {

        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${coach.image}" 
                         class="card-img-top"
                         style="height:300px; object-fit:cover;">

                    <div class="card-body text-center">
                        <h5 class="card-title">${coach.name}</h5>
                        <h6 class="text-muted mb-3">${coach.role}</h6>
                        <p class="card-text">${coach.description}</p>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

/* ======================
   CLASES / PROGRAMAS
====================== */
function renderClasses() {

    const element = document.getElementById('classes-container');
    if (!element || !window.dojoClasses) return;

    element.innerHTML = window.dojoClasses.map(clase => {

        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${clase.image}" 
                         class="card-img-top"
                         style="height:300px; object-fit:cover;">

                    <div class="card-body">
                        <h5 class="card-title">${clase.name}</h5>
                        <p class="text-muted mb-1"><strong>Nivel:</strong> ${clase.level}</p>
                        <p class="text-muted mb-2"><strong>Horario:</strong> ${clase.schedule}</p>
                        <p class="card-text">${clase.description}</p>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

/* ======================
   HORARIOS
====================== */
function renderSchedule() {

    const element = document.getElementById('schedule-container');
    if (!element || !window.dojoSchedule) return;

    const colorMap = {
        mma: "bg-danger text-white",
        bjj: "bg-primary text-white",
        muaythai: "bg-warning",
        wrestling: "bg-dark text-white",
        conditioning: "bg-success text-white"
    };

    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    let table = `
        <div class="table-responsive">
        <table class="table table-bordered text-center align-middle">
            <thead class="table-dark">
                <tr>
                    <th>Horario</th>
                    ${days.map(day => `<th>${day}</th>`).join("")}
                </tr>
            </thead>
            <tbody>
    `;

    // Obtener horas únicas
    const times = [...new Set(window.dojoSchedule.map(item => item.time))];

    times.forEach(time => {
        table += `<tr><td class="fw-bold">${time}</td>`;

        days.forEach(day => {
            const classItem = window.dojoSchedule.find(
                item => item.day === day && item.time === time
            );

            if (classItem) {
                table += `
                    <td class="${colorMap[classItem.type] || 'bg-light'}">
                        ${classItem.class}
                    </td>
                `;
            } else {
                table += `<td></td>`;
            }
        });

        table += `</tr>`;
    });

    table += `</tbody></table></div>`;

    element.innerHTML = table;
}