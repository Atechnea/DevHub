const request = require('supertest');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

// Asegúrate de que la ruta al router sea correcta respecto a la ubicación de este archivo de prueba.
const router = require('../../routes/login.js');

// Mockea la conexión a la base de datos para no realizar operaciones reales durante las pruebas.
jest.mock('../../db/db.js', () => ({
    pool: {
        getConnection: jest.fn(callback => {
            // Aquí controlamos el fallo simulado basado en una condición específica.
            // Asegúrate de ajustar esta condición a lo que necesites para la prueba.
            if (callback.name === "failConnection") {
                return callback(new Error("Fallo de conexión a la base de datos"));
            }

            return callback(null, {
                query: jest.fn((sql, values, callback) => {
                    // Por defecto, simula que no se encuentran resultados.
                    callback(null, []); 
                }),
                release: jest.fn(),
            });
        }),
    },
}));

describe('POST /login', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use(session({ secret: 'testsecret', resave: false, saveUninitialized: false }));
        app.use('/', router);
    });

    test('should return 422 if email is invalid', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'invalid_email', contrasena: 'password' });
        expect(response.status).toBe(422);
        expect(response.body.error).toBe("El correo no tiene un formato válido, por favor, introduzca un correo válido.");
    });

    test('should return 422 if password is empty', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'valid_email@example.com', contrasena: '' });
        expect(response.status).toBe(422);
        expect(response.body.error).toBe("Por favor, escriba la contrasena");
    });

    test('should return 500 if database connection fails', async () => {
        // Redefine el mock de getConnection específicamente para este test.
        require('../../db/db.js').pool.getConnection.mockImplementationOnce(callback => 
            callback(new Error("Fallo de conexión a la base de datos"), null)
        );
    
        const response = await request(app)
            .post('/login')
            .send({ email: 'valid_email@example.com', contrasena: 'triggerConnectionFail' });
    
        expect(response.status).toBe(500);
        expect(response.body.error).toBe("No se pudo conectar a la base de datos, por favor, inténtelo de nuevo más tarde.");
    });

    test('should return 401 if password is incorrect', async () => {
        // Redefine el mock de getConnection para simular encontrar un usuario existente,
        // pero donde la contraseña proporcionada no coincidirá con la almacenada.
        require('../../db/db.js').pool.getConnection.mockImplementationOnce(callback => 
            //objeto simulando la bbdd
            callback(null, {
                //simulamos haber encontrado un usuario con el email proporcionado cuya contraseña es fakehashe... distinta a la establecida en este caso
                query: jest.fn((sql, values, callback) => {
                    // Simula encontrar un usuario existente con una contraseña hash almacenada.
                    const fakeHashedPassword = bcrypt.hashSync('correctpassword', 10);
                    callback(null, [{ email: 'existing@example.com', contrasena: fakeHashedPassword }]);
                }),
                //liberacion de la conexion
                release: jest.fn(),
            })
        );
    
        // Llama a la función de comparación de bcrypt directamente en tu código de ruta o controlador
        // para comparar la contraseña proporcionada ('wrongpassword') con la hash almacenada.
        // Este paso es crucial y debe estar implementado en tu lógica de autenticación.
    
        //solicitud a log in de nuestra aplicacion
        //estamos haciendo log in del correo existing.. que hemos hecho coincidir con la query simulada 
        //y de contraseña wrongpass.. distinta de la que tenemos asociada a ese email en la consulta simulada a la bbdd
        const response = await request(app)
            .post('/login')
            .send({ email: 'existing@example.com', contrasena: 'wrongpassword' }); // Contraseña incorrecta
    
            //Verificas que el estatus HTTP de la respuesta sea 401, lo cual indica una autenticación fallida.
            // También, verificas que el cuerpo de la respuesta contenga un mensaje de error específico,
            // indicando que la contraseña proporcionada es incorrecta.
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("La contrasena no es correcta.");
    });
    test('should return 422 if user does not exist', async () => {
        // Redefine el mock de getConnection para simular que no se encuentra ningún usuario con el correo electrónico proporcionado.
        require('../../db/db.js').pool.getConnection.mockImplementationOnce(callback => 
            callback(null, {
                query: jest.fn((sql, values, callback) => {
                    // Simula no encontrar ningún usuario, devolviendo un array vacío.
                    callback(null, []);
                }),
                release: jest.fn(),
            })
        );
    
        // Envía una solicitud de inicio de sesión con un correo electrónico inexistente.
        const response = await request(app)
            .post('/login')
            .send({ email: 'inexistent@example.com', contrasena: 'any_password' });
    
        // Espera recibir un estado 422, indicando que el usuario no existe.
        expect(response.status).toBe(422);
        expect(response.body.error).toBe("Este correo no existe en nuestra base de datos.");
    });
});