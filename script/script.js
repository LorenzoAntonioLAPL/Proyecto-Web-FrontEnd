let participantes = [];
let exclusiones = [];

// obtener todos los participantes incluyendo organizador si participa
function obtenerTodosParticipantes() {

    let lista = [...participantes];

    const organizador = document.getElementById("organizador").value.trim();
    const participa = document.getElementById("participa").checked;

    if (participa && organizador !== "" && !lista.includes(organizador)) {
        lista.push(organizador);
    }

    return lista;
}


// agregar participante
function agregarParticipante() {

    const input = document.getElementById("nuevoParticipante");
    const nombre = input.value.trim();

    if (nombre === "") return;

    participantes.push(nombre);
    input.value = "";

    renderParticipantes();
}


// mostrar participantes
function renderParticipantes() {

    const lista = document.getElementById("listaParticipantes");
    lista.innerHTML = "";

    const todos = obtenerTodosParticipantes();

    todos.forEach((persona, index) => {

        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = persona;
        li.draggable = true;

        li.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text", persona);
        });

        lista.appendChild(li);
    });
}


// zona de exclusiones
const zona = document.getElementById("zonaExclusion");

zona.addEventListener("dragover", (e) => e.preventDefault());

zona.addEventListener("drop", (e) => {

    e.preventDefault();

    const persona = e.dataTransfer.getData("text");

    crearExclusion(persona);
});


// crear exclusiones
function crearExclusion(persona) {

    zona.innerHTML = "";

    const select = document.createElement("select");
    select.className = "form-select";

    const todos = obtenerTodosParticipantes();

    todos.forEach(p => {

        if (p !== persona) {

            const option = document.createElement("option");
            option.value = p;
            option.textContent = p;

            select.appendChild(option);
        }
    });

    const btn = document.createElement("button");
    btn.textContent = "Guardar exclusión";
    btn.className = "btn btn-danger mt-2";

    btn.onclick = () => {

        exclusiones.push({
            persona: persona,
            noPuedeCon: [select.value]
        });

        Swal.fire({
            icon: "success",
            title: "Exclusión guardada",
            text: persona + " no podrá sacar a " + select.value
        });

        zona.innerHTML = "";
    };

    zona.appendChild(document.createTextNode(persona + " no puede con: "));
    zona.appendChild(select);
    zona.appendChild(btn);
}


// guardar evento
function guardarEvento() {

    const evento = {

        organizador: {
            nombre: document.getElementById("organizador").value,
            participa: document.getElementById("participa").checked
        },

        participantes: participantes,
        exclusiones: exclusiones,

        celebracion: document.getElementById("celebracion").value,
        fecha: document.getElementById("fecha").value,
        presupuesto: document.getElementById("presupuesto").value
    };

    localStorage.setItem("eventoIntercambio", JSON.stringify(evento));

    window.location.href = "sorteo.html";
}


// actualizar lista si cambia organizador o participa
document.getElementById("participa").addEventListener("change", renderParticipantes);
document.getElementById("organizador").addEventListener("input", renderParticipantes);