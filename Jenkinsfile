pipeline {
  agent any

  options {
    skipDefaultCheckout()
  }

  tools {
    nodejs "node"
  }

  environment {
    registry = "joseantoniotortosa/devhub"
    registryCredential = 'id'
    dockerImage = ''
  }

  stages {
    stage('Install') {
      steps {
        git branch: 'main', url: 'https://github.com/Atechnea/DevHub.git'
        dir('Test') {
          echo 'Descargando la última versión...'
          sh 'npm install'
        }
      }
    }

    stage('Testing') {
      steps {
        dir('Test') {
          echo 'Ejecutando los tests...'
          catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
            sh 'npx jest Test'
          }
        }
        script {
          if (currentBuild.result == 'FAILURE') {
            echo 'Los tests han fallado. Realizando acción específica...'
            error 'Los tests han fallado.' //Si los test no funcionan, marcamos la etapa como fallida
          } else {
            echo 'Los tests han pasado satisfactoriamente.'
          }
        }
      }
    }

    stage('Build') {
      steps {
          script {
            echo 'Creando versión actual...'
            dockerImage = docker.build()
          }
      }
    }

    stage('Deploy') {
      steps {
        script {
          echo 'Generando nueva versión...'
          docker.withRegistry('', registryCredential) {
            dockerImage.push()
          }
        }
      }
    }
  }
}
