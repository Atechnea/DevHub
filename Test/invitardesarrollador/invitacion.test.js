const request = require('supertest');
const express = require('express');
const session = require('express-session');
const router = require('../../routes/invitaciones.js');  // Ajustar la ruta según sea necesario

// Mock de la conexión a la base de datos
jest.mock('../../db/db', () => ({
    pool: {
      getConnection: jest.fn().mockImplementation(callback => {
        callback(null, {
          query: jest.fn((sql, params, callback) => {
            if (sql.includes('SELECT * FROM invitaciones')) {
              // Simula que no hay invitaciones existentes
              callback(null, []);
            } else if (sql.includes('INSERT INTO invitaciones')) {
              // Simula una inserción exitosa
              callback(null, { affectedRows: 1 });
            }
          }),
          release: jest.fn()
        });
      })
    }
  }));
        
        const app = express();
        app.use(express.json());
        app.use('/', router);
        
        describe('POST /envio_invitacion', () => {
          test('Enviar invitación correctamente', async () => {
            const response = await request(app)
              .post('/envio_invitacion')
              .send({ empId: '1', equipoId: '2', desId: '3' });
            expect(response.status).toBe(200);
            expect(response.text).toBe('ok');
          });
        
          test('Manejo de errores al enviar invitación cuando ya existe una', async () => {
            // Primero, simula que ya existe una invitación
            require('../../db/db').pool.getConnection.mockImplementationOnce(callback => {
              callback(null, {
                query: jest.fn((sql, params, callback) => {
                  if (sql.includes('SELECT * FROM invitaciones')) {
                    // Simula que ya hay una invitación existente
                    callback(null, [{ id: 1 }]);
                  }
                }),
                release: jest.fn()
              });
            });
        
            const response = await request(app)
              .post('/envio_invitacion')
              .send({ empId: '1', equipoId: '2', desId: '3' });
            expect(response.status).toBe(422);
            expect(response.body.error).toBe("Ya has enviado una invitación a esta persona");
          });
        
          test('Manejo de error de conexión a la base de datos', async () => {
            // Simula un error de conexión a la base de datos
            require('../../db/db').pool.getConnection.mockImplementationOnce(callback => {
              callback(new Error("Error de conexión a la base de datos"), null);
            });
        
            const response = await request(app)
              .post('/envio_invitacion')
              .send({ empId: '1', equipoId: '2', desId: '3' });
            expect(response.status).toBe(500);
            expect(response.body.error).toBe("Error de conexión a la base de datos");
          });
        });