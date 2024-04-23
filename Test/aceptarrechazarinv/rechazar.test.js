const rejectInvitation = require('../../routes/home.js').rejectInvitation;

describe('Función rejectInvitation', () => {
  
  it('Debería resolver la promesa y confirmar que la invitación se rechazó correctamente', () => {
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        // Simular que la consulta de actualización se ejecutó sin errores y actualizó una fila
        callback(null, { affectedRows: 1 }); 
      }),
      release: jest.fn() 
    };

    const invitationId = 123; // ID de la invitación

    return rejectInvitation(invitationId, conMock)
      .then(result => {
        // Verificar que la promesa se resuelve correctamente y devuelve el mensaje esperado
        expect(result).toEqual({status: 200, msg: 'Invitación rechazada exitosamente.'});
        expect(conMock.query).toHaveBeenCalledWith(expect.any(String), [invitationId], expect.any(Function));
      })
      .catch(error => {
        // Si la promesa se rechaza, forzar que el test falle
        expect(error).toBeNull();
      });
  });

  it('Debería rechazar la promesa con un mensaje de error 500 si ocurre un error interno del servidor', () => {
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        // Simular un error interno del servidor
        callback(new Error('Error interno del servidor'), null); 
      }),
      release: jest.fn() 
    };

    const invitationId = 123; // ID de la invitación

    return rejectInvitation(invitationId, conMock)
      .then(() => {
        // Si la promesa se resuelve, forzar que el test falle
        expect(true).toBe(false); // No debería llegar aquí
      })
      .catch(error => {
        // Verificar que la promesa se rechaza con el error esperado
        expect(error).toEqual({status: 500, msg: 'Error interno del servidor'});
      });
  });

  it('Debería rechazar la promesa con un mensaje de error 404 si la invitación no existe', () => {
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        // Simular que la consulta de actualización se ejecutó sin errores pero no actualizó ninguna fila
        callback(null, { affectedRows: 0 }); 
      }),
      release: jest.fn() 
    };

    const invitationId = 123; // ID de la invitación

    return rejectInvitation(invitationId, conMock)
      .then(() => {
        // Si la promesa se resuelve, forzar que el test falle
        expect(true).toBe(false); // No debería llegar aquí
      })
      .catch(error => {
        // Verificar que la promesa se rechaza con el error esperado
        expect(error).toEqual({status: 404, msg: 'La invitación no existe'});
      });
  });
});