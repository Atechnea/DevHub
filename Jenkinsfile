pipeline {
    environment {
    registry = "naistangz/docker_automation"
    registryCredential = 'dockerhub'
    dockerImage = ''
    }

    options {
    skipDefaultCheckout()
    }

    tools
    {
    nodejs "node"
    }

    parameters {
    string(name: 'nombre_contenedor', defaultValue: 'pagina_web', description: 'Nombre del contenedor de docker.')
    string(name: 'imagen_contenedor', defaultValue: 'pagina_img', description: 'Nombre de la imagen docker.')
    string(name: 'tag_imagen', defaultValue: 'lts', description: 'Tag de la imagen de la página.')
    string(name: 'puerto_contenedor', defaultValue: '3000', description: 'Puerto que usa el contenedor')
    string(name: 'registry', defaultValue: 'joseantoniotortosa/devhub', description: 'Registro')
    string(name: 'registryCredential', defaultValue: 'id', description: 'Credenciales')
    string(name: 'dockerImage', defaultValue: '', description: 'Imagen docker')
  }

    agent any
    stages {
            stage('Cloning our Git') {
                steps {
                git 'git@github.com:naistangz/Docker_Jenkins_Pipeline.git'
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

            stage('Building Docker Image') {
                steps {
                    script {
                        dockerImage = docker.build registry + ":$BUILD_NUMBER"
                    }
                }
            }

            stage('Deploying Docker Image to Dockerhub') {
                steps {
                    script {
                        docker.withRegistry('', registryCredential) {
                        dockerImage.push()
                        }
                    }
                }
            }

            stage('Cleaning Up') {
                steps{
                  sh "docker rmi --force $registry:$BUILD_NUMBER"
                }
            }
        }
    }