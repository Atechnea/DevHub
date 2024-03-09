pipeline {
  agent any
  
  tools
  {
    nodejs "node"
  }


  parameters {
    string(name: 'container_name', defaultValue: 'pagina_web', description: 'Nombre del contenedor de docker.')
    string(name: 'containerimage_name', defaultValue: 'pagina_img', description: 'Nombre de la imagen docker.')
    string(name: 'tag_image', defaultValue: 'lts', description: 'Tag de la imagen de la página.')
    string(name: 'container_port', defaultValue: '8080', description: 'Puerto que usa el contenedor')
  }

  

  stages {
    stage('Install') {
      steps {
        git branch: 'main', url: 'https://github.com/Atechnea/DevHub.git'
        dir('Test') {
          echo 'Descargando la ultima version...'
          bat "npm install"
        }
        
      }
    }


    stage('Testing') {
      steps {
          dir('Test') {
            echo 'Ejecutando los tests...'
            catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                bat 'npx jest Test'
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

    
    stage('Build') {
      steps {
        dir('Test') {
          script {
            try {
              echo 'Eliminando version actual...'
              bat 'docker stop ${container_name}'
              bat 'docker rm ${container_name}'
              bat 'docker rmi ${containerimage_name}:${tag_image}'
            } catch (Exception e) {
              echo 'Ha surgido un error al eliminar la version actual: ' + e.toString()
            }
          }
          //Sube la nueva
          echo 'Creando version actual...'
          bat 'npm run build'
          bat 'docker build -t ${containerimage_name}:${tag_image} .'
        }
      }
    }
    /*
    stage('Deploy') {
      steps {
        echo 'Generando nueva version...'
        sh 'docker run -d -p ${container_port}:${container_port} --name ${container_name} ${containerimage_name}:${tag_image}'
      }
    }*/
  }

}