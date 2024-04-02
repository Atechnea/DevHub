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
        usuario: '+', //usuario no valido (solo letras,numero,_)
        nombre: 'Nombre',
        apellido: 'Apellido',
        email: 'luisre@ucm.es', 
        contrasena: 'Contraseña1',
        empresa: false
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.error).toEqual("Usuario no tiene un formato válido, debe estar formado solo de letras, numeros, _ y . y los caracteres especiales no pueden estar ni al principio ni al final"); // Usa la variable o string directamente
  });
});