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



router.post('/acceptInvitation', function(req, res) {
  const invitationId = req.body.invitationId;

  pool.getConnection(function(err, con) {
      if (err) {
          console.error('Error al obtener una conexión de la pool:', err);
          return res.status(500).send('Error interno del servidor');
      }

      const updateInvitationQuery = `
          UPDATE invitaciones 
          SET contestada = 1 
          WHERE id = ?;
      `;

      con.query(updateInvitationQuery, [invitationId], function(err, updateResult) {
          if (err) {
              con.release();
              console.error('Error al marcar la invitación como contestada:', err);
              return res.status(500).send('Error interno del servidor');
          }

          if (updateResult.affectedRows === 0) {
              con.release();
              return res.status(404).send('La invitación no existe');
          }

          const getInvitationInfoQuery = `
              SELECT id_equipo, id_desarrollador
              FROM invitaciones 
              WHERE id = ?;
          `;

          con.query(getInvitationInfoQuery, [invitationId], function(err, invitationInfo) {
              if (err) {
                  con.release();
                  console.error('Error al obtener información de la invitación:', err);
                  return res.status(500).send('Error interno del servidor');
              }

              if (invitationInfo.length === 0) {
                  con.release();
                  return res.status(404).send('La invitación no existe');
              }

              const idEquipo = invitationInfo[0].id_equipo;
              const idDesarrollador = invitationInfo[0].id_desarrollador;

              // Consulta para verificar si el equipo existe
              const checkTeamQuery = `
                  SELECT COUNT(*) as count
                  FROM equipo
                  WHERE id = ?;
              `;

              con.query(checkTeamQuery, [idEquipo], function(err, teamResult) {
                  if (err) {
                      con.release();
                      console.error('Error al verificar si el equipo existe:', err);
                      return res.status(500).send('Error interno del servidor');
                  }

                  if (teamResult[0].count === 0) {
                      con.release();
                      // Si el equipo no existe, enviar un mensaje de error
                      return res.status(401).send('El equipo al que se hace referencia no existe');
                  }

                  const checkDeveloperInTeamQuery = `
                      SELECT COUNT(*) as count
                      FROM pertenece_equipo
                      WHERE id_equipo = ? AND id_desarrollador = ?;
                  `;

                  con.query(checkDeveloperInTeamQuery, [idEquipo, idDesarrollador], function(err, result) {
                      if (err) {
                          con.release();
                          console.error('Error al verificar si el desarrollador ya pertenece al equipo:', err);
                          return res.status(500).send('Error interno del servidor');
                      }

                      const count = result[0].count;

                      if (count > 0) {
                          con.release();
                          return res.status(200).send('El desarrollador ya pertenece al equipo');
                      }

                      const insertDeveloperQuery = `
                          INSERT INTO pertenece_equipo (id_equipo, id_desarrollador)
                          VALUES (?, ?);
                      `;

                      con.query(insertDeveloperQuery, [idEquipo, idDesarrollador], function(err, insertResult) {
                          con.release();
                          if (err) {
                              console.error('Error al agregar el desarrollador al equipo:', err);
                              return res.status(500).send('Error interno del servidor');
                          }

                          return res.status(200).send('Invitación aceptada exitosamente. Desarrollador agregado al equipo.');
                      });
                  });
              });
          });
      });
  });
});




router.post('/rejectInvitation', function(req, res) {
  const invitationId = req.body.invitationId;

  pool.getConnection(function(err, con) {
      if (err) {
          console.error('Error al obtener una conexión de la pool:', err);
          return res.status(500).send('Error interno del servidor');
      }

      const updateInvitationQuery = `
          UPDATE invitaciones 
          SET contestada = 1 
          WHERE id = ?;
      `;

      con.query(updateInvitationQuery, [invitationId], function(err, updateResult) {
          con.release();
          if (err) {
              console.error('Error al marcar la invitación como contestada:', err);
              return res.status(500).send('Error interno del servidor');
          }

          if (updateResult.affectedRows === 0) {
              return res.status(404).send('La invitación no existe');
          }

          return res.status(200).send('Invitación rechazada exitosamente.');
      });
  });
});


module.exports = router;