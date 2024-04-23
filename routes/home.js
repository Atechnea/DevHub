const { render } = require('ejs');
var express = require('express');
var pool = require('../db/db').pool;
var router = express.Router();

router.get('/', function(req, res) {
  if (res.locals.usuario != null) {
    const idUsuario = res.locals.usuario.id;
    pool.getConnection(function(err, con) {
        if (err) {
            console.error('Error al obtener una conexión de la pool:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        const sql = `
            SELECT i.*, CONCAT(u.nombre, ' ', u.apellido) AS senderName, u2.nombre AS recipient, e.nombre AS teamName
            FROM invitaciones i
            INNER JOIN usuarios u ON i.id_empresa = u.id
            INNER JOIN usuarios u2 ON i.id_desarrollador = u2.id
            INNER JOIN equipo e ON i.id_equipo = e.id
            WHERE i.id_desarrollador = ? AND i.contestada = 0;`;

        con.query(sql, [idUsuario], function(err, results) {
            con.release();
            if (err) {
                console.error('Error al ejecutar la consulta SQL:', err);
                res.status(500).send('Error interno del servidor');
                return;
            }

            // Procesar los resultados de la consulta y crear el arreglo de invitaciones
            const invitations = results.map(invitation => {
                return {
                    senderName: invitation.senderName,
                    recipient: invitation.recipient,
                    teamName: invitation.teamName,
                    invitationId: invitation.id,
                    idSender: invitation.id_empresa,
                    idRecipient: invitation.id_desarrollador,
                    idTeam: invitation.id_equipo
                };
            });

            // Renderizar la plantilla con las invitaciones
            res.render('home', { invitations: invitations });
        });
    });
} else {
    res.redirect('login');
}
});

router.post("/busqueda", function (request, response) {
  response.status(200);
  let nombre = request.body.busqueda;
  let usuario = request.session.usuario;
  const dao = request.dao;
  if(usuario.es_empresa == 1){
    pool.getConnection(async function(err, con) {
      if(err) res.status(500).json({ error: buscar_error });
      else{
        const sql = `SELECT id, nombre, apellido, usuario
        FROM usuarios
        WHERE nombre LIKE ? AND es_empresa = false
        ORDER BY nombre DESC;`;
        const query = `%${nombre}%`; // Ajusta la consulta para que funcione con 'LIKE'
        con.query(sql, [query], function (err, desarrolladores) {
          con.release();
            if (err) {
                callback(err, null);
            } else {
                response.render('busqueda', {desarrolladores: desarrolladores});
            }
        });
      }
    })
  }
  else{
    pool.getConnection(async function(err, con) {
      if(err) res.status(500).json({ error: buscar_error });
      else{
        const sql = `SELECT id, nombre, apellido, usuario 
        FROM usuarios 
        WHERE nombre LIKE ? AND es_empresa = true 
        ORDER BY nombre DESC;`;
        const query = `%${nombre}%`; // Ajusta la consulta para que funcione con 'LIKE'
        con.query(sql, [query], function (err, empresas) {
          con.release();
            if (err) {
                callback(err, null);
            } else {
                response.render('busquedaEmp', {empresas: empresas});
            }
        });
      }
    })

  }
});

function acceptInvitation(invid, con) {
    var promesa = new Promise(function(resolve, reject) {
        const updateInvitationQuery = `
            UPDATE invitaciones 
            SET contestada = 1 
            WHERE id = ?;
        `;
  
        con.query(updateInvitationQuery, [invid], function(err, updateResult) {
            if (err) {
                con.release();
                reject({status: 500, msg: 'Error interno del servidor'});
            }
  
            if (updateResult.affectedRows === 0) {
                con.release();
                reject({status: 404, msg: 'La invitación no existe'});
            }

            resolve();
        });
    })
    return promesa;
}

function getInvitationInfo(invid, con) {
    var promesa = new Promise(function(resolve, reject) {
        const getInvitationInfoQuery = `
            SELECT id_equipo, id_desarrollador
            FROM invitaciones 
            WHERE id = ?;
        `;
        con.query(getInvitationInfoQuery, [invid], function(err, invitationInfo) {
            if (err) {
                con.release();
                reject({status: 500, msg: 'Error interno del servidor'});
            }

            if (invitationInfo.length === 0) {
                con.release();
                reject({status: 404, msg: 'La invitación no existe'});
            }

            const idEquipo = invitationInfo[0].id_equipo;
            const idDesarrollador = invitationInfo[0].id_desarrollador;

            resolve({idEquipo, idDesarrollador});
        });
    })
    return promesa;
}

function checkTeam(idEquipo, con) {
    var promesa = new Promise(function(resolve, reject) {
        // Consulta para verificar si el equipo existe
        const checkTeamQuery = `
            SELECT COUNT(*) as count
            FROM equipo
            WHERE id = ?;
        `;

        con.query(checkTeamQuery, [idEquipo], function(err, teamResult) {
            if (err) {
                con.release();
                reject({status: 500, msg: 'Error interno del servidor'});
            }

            if (teamResult[0].count === 0) {
                con.release();
                reject({status: 401, msg: 'El equipo al que se hace referencia no existe'});
            }

            resolve();
        });
    });
    return promesa;
}

function checkDeveloperInTeam(idEquipo, idDesarrollador, con) {
    var promesa = new Promise(function(resolve, reject) {
        const checkDeveloperInTeamQuery = `
            SELECT COUNT(*) as count
            FROM pertenece_equipo
            WHERE id_equipo = ? AND id_desarrollador = ?;
        `;

        con.query(checkDeveloperInTeamQuery, [idEquipo, idDesarrollador], function(err, result) {
            if (err) {
                con.release();
                reject({status: 500, msg: 'Error interno del servidor'});
            }

            const count = result[0].count;

            if (count > 0) {
                con.release();
                reject({status: 200, msg: 'El desarrollador ya pertenece al equipo'});
            }

            resolve();
        });
    })
    return promesa;
}

function insertDeveloper(idEquipo, idDesarrollador, con) {
    var promesa = new Promise(function(resolve, reject) {
        const insertDeveloperQuery = `
                INSERT INTO pertenece_equipo (id_equipo, id_desarrollador)
                VALUES (?, ?);
        `;

        con.query(insertDeveloperQuery, [idEquipo, idDesarrollador], function(err, insertResult) {
            con.release();
            if (err) {
                reject({status: 500, msg: 'Error interno del servidor'});
            }

            resolve({status: 200, msg: 'Invitación aceptada exitosamente. Desarrollador agregado al equipo.'});
        });
    })
    return promesa;
}

router.post('/acceptInvitation', function(req, res) {
    console.log("Entre loco al router de accept invitacion");
    const invitationId = req.body.invitationId;
    pool.getConnection(function(error, con) {
        if (error) {
            return res.status(500).send('Error interno del servidor');
        }
        acceptInvitation(invitationId, con).then(() => {
            getInvitationInfo(invitationId, con).then(({idEquipo, idDesarrollador}) => {
                checkTeam(idEquipo, con).then(() => {
                    checkDeveloperInTeam(idEquipo, idDesarrollador, con).then(() => {
                        insertDeveloper(idEquipo, idDesarrollador, con).then((result) => {
                            return res.status(result.status).send(result.msg);
                        }).catch((err) => {
                            return res.status(err.status).send(err.msg);
                        })
                    }).catch((err) => {
                        return res.status(err.status).send(err.msg);
                    })
                }).catch((err) => {
                    return res.status(err.status).send(err.msg);
                })
            }).catch((err) => {
                return res.status(err.status).send(err.msg);
            })
        }).catch((err) => {
            return res.status(err.status).send(err.msg);
        });
    });
});

function rejectInvitation(invid, con) {
    var promesa = new Promise(function(resolve, reject) {
        const updateInvitationQuery = `
          UPDATE invitaciones 
          SET contestada = 1 
          WHERE id = ?;
      `;

      con.query(updateInvitationQuery, [invid], function(err, updateResult) {
          con.release();
          if (err) {
            reject({status: 500, msg: 'Error interno del servidor'});
          }

          if (updateResult.affectedRows === 0) {
            reject({status: 404, msg: 'La invitación no existe'});
          }
          resolve({status: 200, msg: 'Invitación rechazada exitosamente.'});
      });
    })
    return promesa;
}

router.post('/rejectInvitation', function(req, res) {
  const invitationId = req.body.invitationId;

  pool.getConnection(function(err, con) {
      if (err) {
          console.error('Error al obtener una conexión de la pool:', err);
          return res.status(500).send('Error interno del servidor');
      }
      rejectInvitation(invitationId, con).then((result) => {
        return res.status(result.status).send(result.msg);
      }).catch((err) => {
        return res.status(err.status).send(err.msg);
      })
  });
});


module.exports = {router, acceptInvitation, getInvitationInfo, checkTeam, checkDeveloperInTeam, insertDeveloper, rejectInvitation};