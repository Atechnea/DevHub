const request = require('supertest');
const express = require('express');
const session = require('express-session');
const app = require('../../app'); // Ajusta la ruta según sea necesario
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
            callback(null, { affectedRows: 1 });
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
    app.use('/equipo', router);
  });

  it('Debería invitar a un desarrollador al equipo', async () => {
    // Definir datos de prueba para la invitación
    const invitacion = {
      usuarioId: 20,
      equipoId: 3,
    };
// Realizar una solicitud HTTP POST simulada para invitar al desarrollador
    const response = await request(app)
      .post('/equipo/invitar')
      .send(invitacion);

    // Verificar que la solicitud se haya completado con éxito (código de estado HTTP 200)
    expect(response.status).toBe(200);

    // Verificar que la respuesta contiene un mensaje de éxito
    expect(response.body.message).toBe('Desarrollador invitado exitosamente al equipo');

    // Opcional: Realizar más comprobaciones sobre los datos de la respuesta según sea necesario
    // Por ejemplo, verificar si la base de datos fue actualizada correctamente
  });
});

describe('Invitar Desarrollador', () => {
    test('Debería invitar a un desarrollador al equipo y aparecer en la página del equipo', async () => {
      // Simula la invitación de un desarrollador al equipo
      const equipoId = 3;
      const usuarioId = 20;
  
      // Invitar desarrollador al equipo
      const response = await request(app)
        .post(`/equipo/${equipoId}/invitarDesarrollador`)
        .send({ equipoId: equipoId, usuarioId: usuarioId });
  
      // Verificar que la invitación fue exitosa
      expect(response.status).toBe(200);
  
      // Obtener la página del equipo después de la invitación
      const equipoResponse = await request(app).get(`/equipo/${equipoId}`);
  
      // Verificar que la solicitud de página del equipo fue exitosa
      expect(equipoResponse.status).toBe(200);
  
      // Verificar que el desarrollador invitado aparece en la página del equipo
      const desarrolladorInvitado = equipoResponse.body.teamInfo.members.find(member => member.id === usuarioId);
      expect(desarrolladorInvitado).toBeDefined();
    });
  });
