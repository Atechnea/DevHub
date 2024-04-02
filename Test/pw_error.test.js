// passwordValidation.test.js
const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());

// Asumimos que tienes un archivo de ruta que puedes importar aquí
const router = require('../routes/register.js'); // Asegúrate de ajustar la ruta
app.use(router);

describe('POST /registrar - Validación de contraseña', () => {
  it('debería fallar cuando la contraseña está vacía', async () => {
    const response = await request(app)
      .post('/registrar')
      .send({
        usuario: 'usuarioPrueba',
        nombre: 'Nombre',
        apellido: 'Apellido',
        email: 'correo@ejemplo.com',
        contrasena: '', // Contraseña vacía
        empresa: false
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.error).toEqual("La contraseña debe estar formada por al menos 8 caracteres, con una letra y un numero."); // Usa la variable o string directamente
  });
});