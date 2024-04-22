const request = require('supertest');
const express = require('express');
const session = require('express-session');
const router = require('../../routes/home');  // Ajustar la ruta según sea necesario

jest.mock('../../db/db.js', () => ({
    pool: {
        getConnection: jest.fn().mockImplementation((callback) => {
            callback(null, {
                query: jest.fn((sql, params, callback) => {
                    if (params.includes(23)) {  // Supone que 23 es el idUsuario actual
                        callback(null, [
                            {
                                senderName: "angel",
                                recipient: "Luis",
                                teamName: "Atechnea",
                                invitationId: 55,
                                idSender: 23,
                                idRecipient: 23,
                                idTeam: 5
                            }
                        ]);
                    } else {
                        callback(null, []);
                    }
                }),
                release: jest.fn()
            });
        })
    }
}));

describe('GET /', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use(session({ secret: 'testsecret', resave: false, saveUninitialized: false }));
        //app.use('/', router);

        // Simula que el usuario está siempre logueado para simplificar
        app.use((req, res, next) => {
            res.locals.usuario = { id: 23 };
            next();
        });
        app.use('/', router);
    });

    test('debe mostrar invitaciones cuando hay invitaciones pendientes', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            invitations: expect.arrayContaining([
                expect.objectContaining({
                    senderName: "angel",
                    recipient: "Luis",
                    teamName: "Atechnea"
                })
            ])
        });
    });
});
