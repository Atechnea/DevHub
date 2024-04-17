const request = require('supertest');
const express = require('express');
const session = require('express-session');
const router = require('../../routes/invitaciones.js');  // Ajustar la ruta según sea necesario

// Mock de la conexión a la base de datos
jest.mock('../../db/db.js', () => ({
    pool: {
        getConnection: jest.fn().mockImplementation((callback) => {
            callback(null, {
                query: jest.fn((sql, params, callback) => {
                    if (params.includes('error')) {
                        callback(new Error("Error de base de datos"), null);
                    } else {
                        if (sql.includes('INSERT INTO invitaciones')) {
                            callback(null, { affectedRows: 1 });
                        } else {
                            // Simular la devolución de desarrolladores que no son miembros del equipo
                            callback(null, [{ id: 1, nombre: 'Dev1', apellido: 'Apellido1' }]);
                        }
                    }
                }),
                release: jest.fn(),
            });
        }),
    },
}));

describe('Invitación a equipo', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use(session({ secret: 'testsecret', resave: false, saveUninitialized: false }));
        app.use('/invitaciones', router);
    });

    test('Enviar invitación correctamente', async () => {
        const response = await request(app)
            .post('/invitaciones/envio_invitacion')
            .send({ empId: '1', equipoId: '1', desId: '2' });
        expect(response.text).toBe("ok");
    });

    test('Manejo de errores al enviar invitación', async () => {
        const response = await request(app)
            .post('/invitaciones/envio_invitacion')
            .send({ empId: 'error', equipoId: '1', desId: '2' });  // Usando 'error' para simular un error de base de datos
        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Error al insertar en la base de datos");
    });

    test('Búsqueda de desarrolladores no miembros de equipo', async () => {
        const response = await request(app)
            .post('/invitaciones/1') // Suponiendo que 1 es el ID del equipo
            .send({ busqueda: 'Dev' });
        expect(response.body).toEqual([{ id: 1, nombre: 'Dev1', apellido: 'Apellido1' }]);
    });

    test('Búsqueda vacia No da error ', async () => {
        const response = await request(app)
            .post('/invitaciones/1') // Suponiendo que 1 es el ID del equipo
            .send({ busqueda: '' });  //busqueda vacia
        expect(response.status).toBe(200);
    });

    // Test para búsqueda sin resultados
test('Búsqueda de desarrolladores sin resultados', async () => {
    const response = await request(app)
        .post('/invitaciones/1')
        .send({ busqueda: 'Inexistente' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
});

});