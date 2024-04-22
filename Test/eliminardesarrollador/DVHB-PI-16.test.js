const request = require('supertest');
const express = require('express');
const session = require('express-session');
const router = require('../../routes/equipo.js');

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
}));

describe('Eliminar Desarrollador Integration Tests', () => {

    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use(session({ secret: 'testsecret', resave: false, saveUninitialized: false }));
        app.use('/equipo', router);
    });

    describe('Eliminar Desarrollador', () => {

        test('Debería eliminar al desarrollador del equipo y no debería aparecer en la página del equipo', async () => {
            // Simula la eliminación de un desarrollador del equipo
            const equipoId = 1;
            const usuarioId = 2;

            // Eliminar desarrollador del equipo
            const response = await request(app)
                .post(`/equipo/${equipoId}/deleteMember`)
                .send({ equipoId: equipoId, usuarioId: usuarioId });

            // Verificar que la eliminación fue exitosa
            expect(response.status).toBe(200);

            // Obtener la página del equipo después de la eliminación
            const equipoResponse = await request(app).get(`/equipo/${equipoId}`);

            // Verificar que la solicitud de página del equipo fue exitosa
            expect(equipoResponse.status).toBe(200);

            // Verificar que el desarrollador eliminado no aparece en la página del equipo
            expect(equipoResponse.body.teamInfo.members.some(member => member.id === usuarioId)).toBe(false);
        });
    });
});
