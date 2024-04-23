// Importar supertest para las pruebas de integración y el app de Express
const request = require('supertest');
const app = require('../../app');  // Asegúrate de que la ruta sea correcta

// Simular el módulo que maneja la conexión a la base de datos
jest.mock('../../db/db.js');

const mockQuery = jest.fn();
const mockRelease = jest.fn();

const pool = require('../../db/db.js');
pool.getConnection = jest.fn().mockImplementation((cb) => cb(null, {
  query: mockQuery,
  release: mockRelease
}));

describe('Invitation Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Accept Invitation', () => {
    test('should handle accepting an invitation correctly', async () => {
      // Simular las respuestas de las consultas de la base de datos
      console.log("Entre loco");
      mockQuery
        .mockImplementationOnce((sql, params, callback) => callback(null, { affectedRows: 1 }))  // Actualizar invitación
        .mockImplementationOnce((sql, params, callback) => callback(null, [{ id_equipo: 1, id_desarrollador: 1 }]))  // Obtener info de invitación
        .mockImplementationOnce((sql, params, callback) => callback(null, [{ count: 1 }]))  // Verificar equipo
        .mockImplementationOnce((sql, params, callback) => callback(null, [{ count: 0 }]))  // Verificar miembro del equipo
        .mockImplementationOnce((sql, params, callback) => callback(null, { insertId: 1 }));  // Insertar desarrollador

      const response = await request(app)
        .post('/home/acceptInvitation')
        .send({ invitationId: 1 });

      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('Invitación aceptada exitosamente. Desarrollador agregado al equipo.');
    }, 20000); // Aumentar el timeout si es necesario
  });

  describe('Reject Invitation', () => {
    test('should handle rejecting an invitation correctly', async () => {
      mockQuery.mockImplementationOnce((sql, params, callback) => callback(null, { affectedRows: 1 }));

      const response = await request(app)
        .post('/home/rejectInvitation')
        .send({ invitationId: 1 });

      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('Invitación rechazada exitosamente.');
    }, 20000); // Aumentar el timeout si es necesario
  });
});
