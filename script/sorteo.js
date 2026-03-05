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
    divResultado.innerHTML = "<h4>Resultados:</h4>";

    for (let i = 0; i < participantes.length; i++) {
        divResultado.innerHTML += `
        <div class="alert alert-info">
            ${participantes[i]} → ${resultado[i]}
        </div>
        `;
    }
}