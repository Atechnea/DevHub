function changeBackgroundColor() {
    const colorPickerInput = document.getElementById('color-picker-input');
    const profileImageContainer = document.querySelector('.profile-image-container');
    const initials = document.getElementById('initials');

    profileImageContainer.style.backgroundColor = colorPickerInput.value;

    // Ocultar la paleta de colores después de seleccionar un color
    const colorPicker = document.getElementById('color-picker');
    colorPicker.style.display = 'none';

    // Cambiar el color de las iniciales a negro si el color de fondo es muy claro
    const color = getComputedStyle(profileImageContainer).getPropertyValue('background-color');
    const rgb = color.match(/\d+/g);
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

    if (brightness > 125) {
        initials.style.color = 'black';
    } else {
        initials.style.color = 'white';
    }
}

function toggleColorPicker() {
    const colorPicker = document.getElementById('color-picker');
    colorPicker.style.display = 'block';
}