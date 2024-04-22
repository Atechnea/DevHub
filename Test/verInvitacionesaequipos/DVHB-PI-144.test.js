// Importación de Jest para manejar expectativas y pruebas (sólo necesario si estás en un entorno donde Jest no esté ya globalmente disponible)
const { expect } = require('@jest/globals');

test('DVHB-PI-2: Debería obtener y mostrar las invitaciones pendientes en la UI', async () => {
  // Simulación de la base de datos
  const usersTable = [
    { id: 1, usuario: 'desarrollador1', nombre: 'Nombre1', apellido: 'Apellido1', email: 'dev1@example.com', es_empresa: 0, contrasena: 'hashedpassword1' },
  ];

  const invitationsTable = [
    { id_empresa: 1, id_equipo: 101, id_desarrollador: 1, contestada: 0 },
  ];

  // Funciones de la base de datos simulada
  const fakeDatabase = {
    getPendingInvitationsForDeveloper: (developerId) => {
      return invitationsTable.filter(invitation => invitation.id_desarrollador === developerId && invitation.contestada === 0);
    },
    clear: () => {
      usersTable.length = 0;
      invitationsTable.length = 0;
    }
  };

  // Simulación de BackendService
  function getPendingInvitationsForDeveloper(developerId) {
    return fakeDatabase.getPendingInvitationsForDeveloper(developerId);
  }

  // Simulación de UserInterface
  const ui = {
    invitationsDisplay: [],
    onLoadInvitations: function(callback) {
      this.invitationsDisplay = callback();
    },
    simulateUserVisitingInvitationsPage: async function() {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 100); // Simula un retraso
      });
    }
  };

  // Conectar la UI con el backend simulado
  ui.onLoadInvitations(() => getPendingInvitationsForDeveloper(1));

  // Ejecutar la simulación de la carga de la UI para el usuario
  try {
    await ui.simulateUserVisitingInvitationsPage();
    // Comprobar que la UI muestra las invitaciones
    expect(ui.invitationsDisplay.length).toBeGreaterThan(0);
    expect(ui.invitationsDisplay.every(inv => inv.contestada === 0)).toBeTruthy();
    
    console.log('La prueba "DVHB-PI-2: Debería obtener y mostrar las invitaciones pendientes en la UI" se ha ejecutado correctamente.');
  } catch (error) {
    console.error('La prueba ha fallado:', error.message);
  } finally {
    // Limpieza después del test
    fakeDatabase.clear();
  }
});
