// emailValidation.test.js
const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());

// Asumimos que tienes un archivo de ruta que puedes importar aquí
const router = require('../routes/register.js'); // Asegúrate de ajustar la ruta
app.use(router);

describe('POST /registrar - Validación de correo electrónico', () => {
  it('debería fallar cuando el correo electrónico tiene un formato incorrecto', async () => {
    const response = await request(app)
      .post('/registrar')
      .send({
        usuario: 'usuarioPrueba',
        nombre: 'Nombre',
        apellido: 'Apellido',
        email: 'FormatoIncorrecto', // Formato incorrecto
        contrasena: 'Contraseña1',
        empresa: false
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.error).toEqual("El correo no tiene un formato válido, por favor, introduzca un correo válido."); // Usa la variable o string directamente
  });
});