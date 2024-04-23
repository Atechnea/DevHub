const request = require('supertest');
const express = require('express');
const session = require('express-session');
const app = require('../../app.js'); // Ajusta la ruta según sea necesario
const bd = require('../../db/db.js');

// Mock de la conexión a la base de datos
jest.mock('../../db/db.js', () => ({
  pool: {
    getConnection: jest.fn().mockImplementation((callback) => {
      callback(null, {
        query: jest.fn((sql, params, callback) => {
          if (params.includes('error')) {
            callback(new Error("Error de base de datos"), null);
          } else {
            // Simular la eliminación exitosa
            if(sql.includes('INSERT INTO invitaciones(id_empresa, id_equipo, id_desarrollador) VALUES (?, ? ,?)')){
              callback(null, { affectedRows: 1 });
            }
            else if(sql.includes('SELECT * FROM invitaciones WHERE id_empresa = ? AND id_equipo = ? AND id_desarrollador = ? AND contestada = 0')){
              callback(null, [{ id_empresa: 2, id_equipo: 2, id_desarrollador: 23, contestada: 0}]);
            }
            else{
              callback(null, { });
            }
            
          }
        }),
        release: jest.fn(),
      });
    }),
  },
  sessionMiddleware: jest.fn().mockImplementation((req, res, next) => {
    // Simula el comportamiento del middleware bd.sessionMiddleware aquí
    // Puedes establecer el usuario en res.locals o req.session según sea necesario
    // Esto puede variar según cómo esté implementado el middleware en tu aplicación
    res.locals.usuario = { id: 2 };
    next(); // Llama a next() para pasar al siguiente middleware en la cadena
  }),
}));

describe('Invitar Desarrollador Integration Tests', () => {
  beforeAll(() => {
    // Configuración inicial de la aplicación Express para las pruebas
    app.use(express.json()); // Habilita el parsing de JSON en las solicitudes
    app.use(session({ secret: 'testsecret', resave: false, saveUninitialized: false })); // Configura sesiones
    app.use(bd.sessionMiddleware); // Usa el middleware de sesión simulado

    // Monta el enrutador 'router' bajo el prefijo de ruta '/equipo'
   
  });

  it('Invitar a un desarrollador al equipo', async () => {
    // Definir datos de prueba para la invitación
    const invitacion = {
      empId: 1, // ID de la empresa
      equipoId: 3, // ID del equipo
      desId: 20, // ID del desarrollador
    };
    // Realizar una solicitud HTTP POST simulada para invitar al desarrollador
    const response = await request(app)
      .post('/invitaciones/envio_invitacion') 
      .send(invitacion);

    // Verificar que la solicitud se haya completado con éxito (código de estado HTTP 200)
    expect(response.status).toBe(200);
  });
});
