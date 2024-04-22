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

describe('Eliminar desarrollador de un equipo', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use(session({ secret: 'testsecret', resave: false, saveUninitialized: false }));
        app.use('/equipo', router);
    });

    test('Eliminar desarrollador correctamente', async () => {
        const response = await request(app)
            .post('/equipo/1/deleteMember')
            .send({ equipoId: '1', usuarioId: '2' });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ affectedRows: 1 });
    });

    test('Manejo de errores al eliminar desarrollador', async () => {
        const response = await request(app)
            .post('/equipo/error/deleteMember')
            .send({ equipoId: 'error', usuarioId: '2' });  // Usando 'error' para simular un error de base de datos
        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Error al consultar la base de datos");
    });

   
});
