const request = require('supertest');
const express = require('express');
const session = require('express-session');
const router = require('../../routes/equipo.js');
const app = require('../../app.js');
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

describe('Eliminar Desarrollador Integration Tests', () => {
  beforeAll(() => {
    app.use(express.json());
    app.use(session({ secret: 'testsecret', resave: false, saveUninitialized: false }));
    // Usa bd.sessionMiddleware en lugar del middleware simulado
    app.use(bd.sessionMiddleware);
    app.use('/equipo', router);
  });

  describe('Eliminar Desarrollador', () => {
    test('Debería eliminar al desarrollador del equipo y no debería aparecer en la página del equipo', async () => {
      // Simula la eliminación de un desarrollador del equipo
      const equipoId = 2;
      const usuarioId = 23;

      // Eliminar desarrollador del equipo
      const response = await request(app)
        .post(`/equipo/${equipoId}/deleteMember`)
        .send({ equipoId: equipoId, usuarioId: usuarioId });

      // Verificar que la eliminación fue exitosa
      expect(response.status).toBe(200);

      // Obtener la página del equipo después de la eliminación
      const equipoResponse = await request(app)
        .get(`/equipo/${equipoId}`);

      // Verificar que la solicitud de página del equipo fue exitosa
      expect(equipoResponse.status).toBe(200);

      // Verificar que el desarrollador eliminado no aparece en la página del equipo
      expect(equipoResponse.body.teamInfo.members.some(member => member.id === usuarioId)).toBe(false);
    });
  });
});
