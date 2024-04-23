const request = require('supertest');
const express = require('express');
const session = require('express-session');
const app = require('../../app.js');
const bd = require('../../db/db.js');

// Mock de la conexión a la base de datos
jest.mock('../../db/db.js', () => {
  const sessionMiddleware = jest.fn().mockImplementation((req, res, next) => {
    res.locals.usuario = { id: 23 };
    next();
  });

  let isPostRequest = false; // Variable para verificar si es una solicitud POST

  return {
    pool: {
      getConnection: jest.fn().mockImplementation((callback) => {
        callback(null, {
          query: jest.fn((sql, params, callback) => {
            if (params.includes('error')) {
              callback(new Error("Error de base de datos"), null);
            } else {
              
                callback(null, { affectedRows: 1 });
              
            }
          }),
          release: jest.fn(),
        });
      }),
    },
    sessionMiddleware: sessionMiddleware,
    setIsPostRequest: (value) => { isPostRequest = value; } // Método para establecer el valor de isPostRequest
  };
});


describe('Eliminar Desarrollador Integration Tests', () => {
  beforeAll(() => {
    app.use(express.json());
    app.use(session({ secret: 'testsecret', resave: false, saveUninitialized: false }));
    app.use(bd.sessionMiddleware);
  });

  describe('Eliminar Desarrollador', () => {
    test('Debería eliminar al desarrollador del equipo y no debería aparecer en la página del equipo', async () => {
      // Simula la eliminación de un desarrollador del equipo
      const equipoId = 2;
      const usuarioId = 23;

      // Antes de realizar la solicitud POST
      bd.setIsPostRequest(true);
      const response = await request(app)
        .post(`/equipo/${equipoId}/deleteMember`)
        .send({ equipoId: equipoId, usuarioId: usuarioId });

      // Después de realizar la solicitud POST
      bd.setIsPostRequest(false);

      // Verificar que la eliminación fue exitosa
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ affectedRows: 1 });

      
    });
  });
});
