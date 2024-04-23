const request = require('supertest');
const express = require('express');
const session = require('express-session');
const app = require('../../app.js');
const bd = require('../../db/db.js');

// Simular el módulo que maneja la conexión a la base de datos
jest.mock('../../db/db.js', () => {
  const sessionMiddleware = jest.fn().mockImplementation((req, res, next) => {
    res.locals.usuario = { id: 2 };
    next();
  });

  return {
    pool: {
      getConnection: jest.fn().mockImplementation((callback) => {
        callback(null, {
          query: jest.fn((sql, params, callback) => {
            if (params.includes('error')) {
              callback(new Error("Error de base de datos"), null);
            } else if (sql.includes('\n            SELECT id_equipo, id_desarrollador\n            FROM invitaciones \n            WHERE id = ?;\n        '))
            {
              callback(null, [{ id_equipo: 1, id_desarrollador: 1 }]);
            }
            else if(sql.includes('\n            SELECT COUNT(*) as count\n            FROM equipo\n            WHERE id = ?;\n        '))
            {
              callback(null, [{ id_equipo: 1}]);
            }
            else if(sql.includes('\n            SELECT COUNT(*) as count\n            FROM pertenece_equipo\n            WHERE id_equipo = ? AND id_desarrollador = ?;\n        '))
            {
              callback(null, [{ id_equipo: 1, id_desarrollador: 1 }]);
            }
            else if(sql.includes('\n            SELECT COUNT(*) as count\n            FROM pertenece_equipo\n            WHERE id_equipo = ? AND id_desarrollador = ?;\n        '))
            {
              callback(null, [{ id_equipo: 1, id_desarrollador: 1 }]);
            }
            else if(sql.includes('\n                INSERT INTO pertenece_equipo (id_equipo, id_desarrollador)\n                VALUES (?, ?);\n        '))
            {
              callback(null, [{ id_equipo: 1, id_desarrollador: 1 }]);
            }
            else
            {
              callback(null, { affectedRows: 1 });
            }
          }),
          release: jest.fn(),
        });
      }),
    },
    sessionMiddleware: sessionMiddleware,
  };
});

describe('Invitation Integration Tests', () => {
  beforeAll(() => {
    app.use(express.json());
    app.use(session({ secret: 'testsecret', resave: false, saveUninitialized: false }));
    // Usa bd.sessionMiddleware en lugar del middleware simulado
    app.use(bd.sessionMiddleware);

  });

  describe('Accept Invitation', () => {
    test('should handle accepting an invitation correctly', async () => {
      // Simular las respuestas de las consultas de la base de datos
        const response = await request(app)
        .post('/home/acceptInvitation')
        .send({ invitationId: 1 });
  
      expect(response.statusCode).toBe(200);
    }); // Aumentar el timeout si es necesario
  });

  describe('Reject Invitation', () => {
    test('should handle rejecting an invitation correctly', async () => {

      const response = await request(app)
        .post('/home/rejectInvitation')
        .send({ invitationId: 1 });

      expect(response.statusCode).toBe(200);
    }); // Aumentar el timeout si es necesario
  });
});
