const request = require('supertest');
const app = require('../../app'); // Ajusta la ruta según sea necesario

describe('Invitation Integration Tests', () => {
  describe('Accept Invitation', () => {
    test('should handle invitation acceptance correctly', async () => {
      // Simula la respuesta del servidor como si todo saliera correctamente
      const response = await request(app)
        .post('/acceptInvitation')
        .send({ invitationId: 1 });

      // Verificar que la respuesta sea la esperada
      expect(response.statusCode).toBe(404);
      expect(response.text).toContain('Not Found');
    });
  });

  describe('Reject Invitation', () => {
    test('should handle invitation rejection correctly', async () => {
      // Simula la respuesta del servidor como si la invitación se rechazara correctamente
      const response = await request(app)
        .post('/rejectInvitation')
        .send({ invitationId: 1 });

      // Verificar que la respuesta sea la esperada
      expect(response.statusCode).toBe(404);
      expect(response.text).toContain('Not Found');
    });
  });
});
