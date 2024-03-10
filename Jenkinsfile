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
            error 'Los tests han fallado.' // Marca la etapa como fallida
          } else {
            echo 'Los tests han pasado satisfactoriamente.'
          }
        }
      }
    }

    // Docker Hub
    stage('Build') {
      steps {
          script {
            // Sube la nueva
            echo 'Creando versión actual...'
            dockerImage = docker.build(registry)
          }
      }
    }

    // Docker Hub
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

    stage('Cleaning up') {
      steps {
        sh "docker rmi $registry:$BUILD_NUMBER"
      }
    }
  }
}
