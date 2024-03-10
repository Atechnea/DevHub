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
          echo 'Descargando la ultima version...'
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

    //Docker Hub
    stage('Build') {
      steps {
        dir('Test') {
          script {
            //Sube la nueva
            echo 'Creando version actual...'
            dockerImage = docker.build registry + ":$BUILD_NUMBER"
          }
        }
      }
    }

    //Docker Hub
    stage('Deploy') {
      steps {
        script {
          echo 'Generando nueva version...'
          docker.withRegistry( '', registryCredential ) {
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