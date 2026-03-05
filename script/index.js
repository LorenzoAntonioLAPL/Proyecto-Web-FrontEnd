
document.addEventListener("DOMContentLoaded", function () {

    const boton = document.getElementById("btnCrear");

    boton.addEventListener("click", function (e) {
        e.preventDefault();

        //se usa el cdn de canvas confetti que decidimos agregar por lo simple que es usarlo
        // Primer disparo de confetti
        confetti({
            particleCount: 150,
            spread: 150,
            origin: { y: 0.7 },
            colors: ['#ff0055', '#facc15', '#3b82f6', '#22c55e']
        });
        // Segundo disparo (reforzo para que no se vea tan vacio jaja) a los 500ms
        setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 150,
                origin: { y: 0.7 },
                colors: ['#ff0055', '#facc15', '#3b82f6', '#22c55e']
            });
        }, 500);

        setTimeout(() => {
            window.location.href = "evento.html";
        }, 3000);
    });

});