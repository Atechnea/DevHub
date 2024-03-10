pipeline {
  agent any
  
  options {
    skipDefaultCheckout()
  }

  tools
  {
    nodejs "node"
  }

    environment { 
      registry = 'joseantoniotortosa/devhub' 
      registryCredential = 'id' 
      dockerImage = '' 
    }


//Red local
/*
  parameters {
    string(name: 'nombre_contenedor', defaultValue: 'pagina_web', description: 'Nombre del contenedor de docker.')
    string(name: 'imagen_contenedor', defaultValue: 'pagina_img', description: 'Nombre de la imagen docker.')
    string(name: 'tag_imagen', defaultValue: 'lts', description: 'Tag de la imagen de la página.')
    string(name: 'puerto_contenedor', defaultValue: '3000', description: 'Puerto que usa el contenedor')
  }*/

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


    //Red local
    /*
    stage('Build') {
      steps {
        dir('Test') {
          script {
            try {
              echo 'Eliminando version actual...'
              sh 'docker stop ${nombre_contenedor}'
              sh 'docker rm ${nombre_contenedor}'
              sh 'docker rmi ${imagen_contenedor}:${tag_imagen}'
            } catch (Exception e) {
              echo 'Ha surgido un error al eliminar la version actual: ' + e.toString()
            }
          }
        }
        
        //Sube la nueva
        echo 'Creando version actual...'
        sh 'docker build -t ${imagen_contenedor}:${tag_imagen} .'
        
      }
    }*/

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

    //Red local
    /*
    stage('Deploy') {
      steps {
        echo 'Generando nueva version...'
        sh 'docker run -d -p ${puerto_contenedor}:${puerto_contenedor} --name ${nombre_contenedor} ${imagen_contenedor}:${tag_imagen}'
      }
    }*/

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




  }

}