const {acceptInvitation, getInvitationInfo, checkTeam, checkDeveloperInTeam, insertDeveloper} = require('../../routes/home.js');

describe('Función acceptInvitation', () => {
  
  it('Debería resolver la promesa si la invitación se actualiza correctamente', () => {
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        // Simular que la consulta se ejecutó sin errores y actualizó una fila
        callback(null, { affectedRows: 1 }); 
      }),
      release: jest.fn() 
    };

    const invid = 123; // ID de la invitación

    return acceptInvitation(invid, conMock)
      .then(() => {
        // Verificar que la promesa se resuelve correctamente
        expect(conMock.query).toHaveBeenCalledWith(expect.any(String), [invid], expect.any(Function));
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

    const invid = 123; // ID de la invitación

    return acceptInvitation(invid, conMock)
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
        // Simular que la consulta se ejecutó sin errores pero no actualizó ninguna fila
        callback(null, { affectedRows: 0 }); 
      }),
      release: jest.fn() 
    };

    const invid = 123; // ID de la invitación

    return acceptInvitation(invid, conMock)
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

describe('Función getInvitationInfo', () => {
  
  it('Debería resolver la promesa y devolver la información de la invitación si la consulta se ejecuta correctamente', () => {
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        // Simular que la consulta se ejecutó sin errores y devolvió información de la invitación
        callback(null, [{ id_equipo: 1, id_desarrollador: 2 }]); 
      }),
      release: jest.fn() 
    };

    const invid = 123; // ID de la invitación

    return getInvitationInfo(invid, conMock)
      .then(info => {
        // Verificar que la promesa se resuelve correctamente y devuelve la información esperada
        expect(info).toEqual({ idEquipo: 1, idDesarrollador: 2 });
        expect(conMock.query).toHaveBeenCalledWith(expect.any(String), [invid], expect.any(Function));
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

    const invid = 123; // ID de la invitación

    return getInvitationInfo(invid, conMock)
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
        // Simular que la consulta se ejecutó sin errores pero no devolvió ninguna información
        callback(null, []); 
      }),
      release: jest.fn() 
    };

    const invid = 123; // ID de la invitación

    return getInvitationInfo(invid, conMock)
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


describe('Función checkTeam', () => {
  
  it('Debería resolver la promesa si el equipo existe', () => {
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        // Simular que la consulta se ejecutó sin errores y el equipo existe
        callback(null, [{ count: 1 }]); 
      }),
      release: jest.fn() 
    };

    const idEquipo = 123; // ID del equipo existente

    return checkTeam(idEquipo, conMock)
      .then(() => {
        // Verificar que la promesa se resuelve correctamente
        expect(conMock.query).toHaveBeenCalledWith(expect.any(String), [idEquipo], expect.any(Function));
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

    const idEquipo = 123; // ID del equipo

    return checkTeam(idEquipo, conMock)
      .then(() => {
        // Si la promesa se resuelve, forzar que el test falle
        expect(true).toBe(false); // No debería llegar aquí
      })
      .catch(error => {
        // Verificar que la promesa se rechaza con el error esperado
        expect(error).toEqual({status: 500, msg: 'Error interno del servidor'});
      });
  });

  it('Debería rechazar la promesa con un mensaje de error 401 si el equipo no existe', () => {
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        // Simular que la consulta se ejecutó sin errores pero el equipo no existe
        callback(null, [{ count: 0 }]); 
      }),
      release: jest.fn() 
    };

    const idEquipo = 123; // ID del equipo

    return checkTeam(idEquipo, conMock)
      .then(() => {
        // Si la promesa se resuelve, forzar que el test falle
        expect(true).toBe(false); // No debería llegar aquí
      })
      .catch(error => {
        // Verificar que la promesa se rechaza con el error esperado
        expect(error).toEqual({status: 401, msg: 'El equipo al que se hace referencia no existe'});
      });
  });
});

describe('Función checkDeveloperInTeam', () => {
  
  it('Debería resolver la promesa si el desarrollador no pertenece al equipo', () => {
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        // Simular que la consulta se ejecutó sin errores y el desarrollador no pertenece al equipo
        callback(null, [{ count: 0 }]); 
      }),
      release: jest.fn() 
    };

    const idEquipo = 123; // ID del equipo
    const idDesarrollador = 456; // ID del desarrollador

    return checkDeveloperInTeam(idEquipo, idDesarrollador, conMock)
      .then(() => {
        // Verificar que la promesa se resuelve correctamente
        expect(conMock.query).toHaveBeenCalledWith(expect.any(String), [idEquipo, idDesarrollador], expect.any(Function));
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

    const idEquipo = 123; // ID del equipo
    const idDesarrollador = 456; // ID del desarrollador

    return checkDeveloperInTeam(idEquipo, idDesarrollador, conMock)
      .then(() => {
        // Si la promesa se resuelve, forzar que el test falle
        expect(true).toBe(false); // No debería llegar aquí
      })
      .catch(error => {
        // Verificar que la promesa se rechaza con el error esperado
        expect(error).toEqual({status: 500, msg: 'Error interno del servidor'});
      });
  });

  it('Debería rechazar la promesa con un mensaje de error 200 si el desarrollador ya pertenece al equipo', () => {
    const conMock = {
      query: jest.fn((querySql, params, callback) => {
        // Simular que la consulta se ejecutó sin errores pero el desarrollador ya pertenece al equipo
        callback(null, [{ count: 1 }]); 
      }),
      release: jest.fn() 
    };

    const idEquipo = 123; // ID del equipo
    const idDesarrollador = 456; // ID del desarrollador

    return checkDeveloperInTeam(idEquipo, idDesarrollador, conMock)
      .then(() => {
        // Si la promesa se resuelve, forzar que el test falle
        expect(true).toBe(false); // No debería llegar aquí
      })
      .catch(error => {
        // Verificar que la promesa se rechaza con el error esperado
        expect(error).toEqual({status: 200, msg: 'El desarrollador ya pertenece al equipo'});
      });
  });
});


