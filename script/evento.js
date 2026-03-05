let participantes = [];
let exclusiones = [];
// Para lo de las exclusiones tener info de quien anda en el espacio y actualizar los datos
let participanteActual = null;


// obtener todos los participantes incluyendo organizador si participa
function obtenerTodosParticipantes() {

    // Solo recupera lo que me interesa en este caso los participantes
    let lista = [...participantes];

    // agarro la informacion de los elementos de html
    const organizador = document.getElementById("organizador").value.trim();
    const participa = document.getElementById("participa").checked;

    //y checo si no esta vacio y si no se encuentra ya en la lista
    if (participa && organizador !== "" && !lista.includes(organizador)) {
        lista.push(organizador);
    }

    return lista;
}


// agregar participante
function agregarParticipante() {

    const input = document.getElementById("nuevoParticipante");
    const nombre = input.value.trim();

    //simplemetne si esta vacio no agrega
    if (nombre === "") return;

    participantes.push(nombre);

    //limpia el valor del espacio donde se escribe
    input.value = "";

    renderParticipantes();
}


// mostrar participantes
function renderParticipantes() {
    // saco los datos de la lista
    const lista = document.getElementById("listaParticipantes");
    lista.innerHTML = "";

    const todos = obtenerTodosParticipantes();

    todos.forEach((persona) => {

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

    participanteActual = persona;

    mostrarBotonesExclusion(persona);
});


// mostrar botones dinámicos
function mostrarBotonesExclusion(persona) {

    zona.innerHTML = "";

    const titulo = document.createElement("h6");
    titulo.textContent = "Selecciona con quién NO puede sacar regalo:";
    zona.appendChild(titulo);

    const subtitulo = document.createElement("p");
    subtitulo.className = "fw-bold";
    subtitulo.textContent = persona;
    zona.appendChild(subtitulo);

    const contenedor = document.createElement("div");
    contenedor.className = "d-flex flex-wrap gap-2";

    const todos = obtenerTodosParticipantes();

    todos.forEach(p => {

        if (p === persona) return;

        const btn = document.createElement("button");

        btn.textContent = p;
        btn.className = "btn btn-outline-primary";

        // verificar si ya existe exclusión
        const registro = exclusiones.find(e => e.persona === persona);

        if (registro && registro.noPuedeCon.includes(p)) {
            btn.classList.remove("btn-outline-primary");
            btn.classList.add("btn-danger");
        }

        btn.onclick = () => toggleExclusion(persona, p, btn);

        contenedor.appendChild(btn);
    });

    zona.appendChild(contenedor);
}


// seleccionar / deseleccionar exclusión
function toggleExclusion(origen, destino, boton) {

    let registro = exclusiones.find(e => e.persona === origen);

    if (!registro) {

        registro = {
            persona: origen,
            noPuedeCon: []
        };

        exclusiones.push(registro);
    }

    const todos = obtenerTodosParticipantes();
    const maxExclusiones = todos.length - 2;

    const index = registro.noPuedeCon.indexOf(destino);

    // SI NO ESTÁ EXCLUIDO -> INTENTA EXCLUIR
    if (index === -1) {

        if (registro.noPuedeCon.length >= maxExclusiones) {
            mostrarAlerta("Debe quedar al menos un participante disponible", "warning");
            return;
        }

        registro.noPuedeCon.push(destino);

        boton.classList.remove("btn-outline-primary");
        boton.classList.add("btn-danger");

    }// SI YA ESTÁ EXCLUIDO -> LO QUITA
    else {
        registro.noPuedeCon.splice(index, 1);

        boton.classList.remove("btn-danger");
        boton.classList.add("btn-outline-primary");
    }

    console.log(exclusiones);
}


function guardarEvento() {

    // saco la informacion de todo

    const organizador = document.getElementById("organizador").value.trim();
    const participa = document.getElementById("participa").checked;

    const celebracion = document.getElementById("celebracion").value.trim();
    const fecha = document.getElementById("fecha").value;
    const presupuesto = document.getElementById("presupuesto").value;

    const todos = obtenerTodosParticipantes();

    // Validaciones

    if (organizador === "") {
        mostrarAlerta("Debes ingresar el nombre del organizador", "warning");
        return;
    }

    if (todos.length < 2) {
        mostrarAlerta("Debe haber al menos 2 participantes para realizar el sorteo", "warning");
        return;
    }

    if (celebracion === "" || fecha === "" || presupuesto === "") {
        mostrarAlerta("Faltan campos por completar en los datos del evento", "warning");
        return;
    }

    // SI TODO ESTÁ BIEN entonces si lo guardo jaja
    const evento = {

        organizador: {
            nombre: organizador,
            participa: participa
        },

        participantes: participantes,
        exclusiones: exclusiones,

        celebracion: celebracion,
        fecha: fecha,
        presupuesto: presupuesto
    };

    localStorage.setItem("eventoIntercambio", JSON.stringify(evento));

    window.location.href = "sorteo.html";
}

// alerta de bootstrap con insercion de html
function mostrarAlerta(mensaje, tipo = "danger") {

    const alerta = document.getElementById("alerta");

    alerta.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
        </div>
    `;

    setTimeout(() => {
        alerta.innerHTML = "";
    }, 3000);
}

// actualizar lista si cambia organizador o participa
document.getElementById("participa").addEventListener("change", renderParticipantes);
document.getElementById("organizador").addEventListener("input", renderParticipantes);