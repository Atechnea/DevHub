pipeline {
    agent any // El agente donde se ejecutará el pipeline, "any" significa que puede ejecutarse en cualquier agente disponible
    
    stages {
        stage('Clonar repositorio') { // Definición de una etapa llamada "Clonar repositorio"
            steps {
                git 'https://github.com/Atechnea/DevHub.git' // Clona el repositorio desde GitHub
            }
        }
        
        stage('Compilar') { // Definición de una etapa llamada "Compilar"
            steps {
                // Aquí colocarías los comandos necesarios para compilar tu proyecto
                // Ejemplo:
                sh 'mvn clean compile' // Ejecuta el comando Maven para limpiar y compilar el proyecto
            }
        }
        
        stage('Pruebas') { // Definición de una etapa llamada "Pruebas"
            steps {
                // Aquí colocarías los comandos necesarios para ejecutar tus pruebas
                // Ejemplo:
                sh 'mvn test' // Ejecuta el comando Maven para ejecutar las pruebas unitarias
            }
        }
        
        stage('Desplegar') { // Definición de una etapa llamada "Desplegar"
            steps {
                // Aquí colocarías los comandos necesarios para desplegar tu aplicación
                // Ejemplo:
                sh 'mvn deploy' // Ejecuta el comando Maven para desplegar la aplicación
            }
        }
    }
}
