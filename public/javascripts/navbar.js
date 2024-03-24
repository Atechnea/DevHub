document.getElementById('crear-equipo').addEventListener('click', function(event) {
    event.preventDefault(); // Evita que el enlace recargue la página

    // Aquí puedes realizar la carga del archivo 'CrearEquipo.ejs' y mostrar su contenido en la página
    fetch('views/CrearEquipo.ejs')
        .then(response => response.text())
        .then(data => {
            // Inserta el contenido en el lugar adecuado de tu página
            document.getElementById('contenido').innerHTML = data;
        })
        .catch(error => console.error('Error al cargar el archivo', error));
});