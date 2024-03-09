pipeline {
  agent any

  parameters {
    string(name: 'container_name', defaultValue: 'pagina_web', description: 'Nombre del contenedor de docker.')
    string(name: 'containerimage_name', defaultValue: 'pagina_img', description: 'Nombre de la imagen docker.')
    string(name: 'tag_image', defaultValue: 'lts', description: 'Tag de la imagen de la página.')
    string(name: 'container_port', defaultValue: '8080', description: 'Puerto que usa el contenedor')
  }

  stages {
    stage('Install') {
      steps {

        dir('Test') {
          echo 'Descargando la ultima version...'
          git branch: 'main', url: 'https://github.com/Atechnea/DevHub.git'
          sh 'npm install'
        }
        
      }
    }

    
    stage('Testing') {
      steps {
          echo 'Ejecutando los tests...'
          catchError(buildResult: 'FAILED', stageResult: 'FAILED') {
              sh 'npx jest Test'
          }

          script {
            currentBuild.result = 'FAILURE'
            echo 'Los tests fallaron. Por favor, revise los resultados.'
          }
      }
    }

    stage('Build') {
      steps {
        dir('Test') {
          script {
            try {
              echo 'Eliminando version actual...'
              sh 'docker stop ${container_name}'
              sh 'docker rm ${container_name}'
              sh 'docker rmi ${containerimage_name}:${tag_image}'
            } catch (Exception e) {
              echo 'Ha surgido un error al eliminar la version actual: ' + e.toString()
            }
          }
          //Sube la nueva
          echo 'Creando version actual...'
          sh 'npm run build'
          sh 'docker build -t ${containerimage_name}:${tag_image} .'
        }
      }
    }

    stage('Deploy') {
      steps {
        echo 'Generando nueva version...'
        sh 'docker run -d -p ${container_port}:${container_port} --name ${container_name} ${containerimage_name}:${tag_image}'
      }
    }
  }

}