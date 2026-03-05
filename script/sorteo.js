const datos = JSON.parse(localStorage.getItem("eventoIntercambio"));
const contenedor = document.getElementById("datosEvento");

let listaParticipantes = [...datos.participantes];

if (datos.organizador.participa &&
    !listaParticipantes.includes(datos.organizador.nombre)) {
    listaParticipantes.push(datos.organizador.nombre);
}

contenedor.innerHTML = `
<strong>Organizador:</strong> ${datos.organizador.nombre}<br>
<strong>Celebración:</strong> ${datos.celebracion}<br>
<strong>Fecha:</strong> ${datos.fecha}<br>
<strong>Presupuesto:</strong> $${datos.presupuesto}<br>
<strong>Participantes:</strong> ${listaParticipantes.join(", ")}
`;

// Funcion para mezclar participantes
function mezclarParticipantes(lista) {
    let copia = [...lista];

    for (let i = copia.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
}

// Verificar si el sorteo es valido
function sorteoValido(original, mezclado, exclusiones) {

    for (let i = 0; i < original.length; i++) {

        if (original[i] === mezclado[i]) {
            return false;
        }

        // verificar exclusiones
        for (let ex of exclusiones) {
            if (ex.persona === original[i]) {
                if (ex.noPuedeCon.includes(mezclado[i])) {
                    return false;
                }
            }
        }
    }

    return true;
}

function realizarSorteo() {

    let participantes = [...datos.participantes];

    // agregar organizador si participa
    if (datos.organizador.participa &&
        !participantes.includes(datos.organizador.nombre)) {
        participantes.push(datos.organizador.nombre);
    }

    let resultado;
    let valido = false;

    // repetir hasta encontrar uno valido
    while (!valido) {
        resultado = mezclarParticipantes(participantes);
        valido = sorteoValido(participantes, resultado, datos.exclusiones);
    }

    const divResultado = document.getElementById("resultado");
    divResultado.innerHTML = `
        <h4 class="mb-3 text-center">Resultados del Sorteo :)</h4>
        <div class="row g-3" id="gridResultados"></div>
    `;

    const grid = document.getElementById("gridResultados");

    for (let i = 0; i < participantes.length; i++) {
        // asi nomas inserto un card de bootstrap pero con los datos del sorteo
        setTimeout(() => {
            grid.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card shadow resultado-card text-center h-100">
                    <div class="card-body">
                        <h5 class="card-title">${participantes[i]}</h5>
                        <p class="card-text">le regala a</p>
                        <h4 class="text-primary">${resultado[i]}</h4>
                    </div>
                </div>
            </div>
            `;

        }, i * 200); //para que se vea escalonado tipo hacer que aparezcan lentito una tras otra porque agarra el 200 mas que el anterior
        confetti({
            particleCount: 250,
            spread: 360, // Dispersión reducida para un efecto de lluvia
            origin: { y: -.5 }, // Lanza desde la parte superior de la pantalla
            colors: ['#ff0055', '#facc15', '#3b82f6', '#22c55e']
        });
    }
    
}