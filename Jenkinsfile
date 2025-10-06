pipeline {
  agent any

  tools {
	maven 'Maven-3.9.11'
        jdk 'jdk-21'
  }
  
  stages {
    stage('Build Maven'){
        environment {
          DATASOURCE_URL = "jdbc:postgresql://ep-curly-mouse-adatc3x8-pooler.c-2.us-east-1.aws.neon.tech/product-virunga-DB"
        }
        steps {
            checkout scmGit(
                branches: [[name: '*/main']],
                extensions: [],
                userRemoteConfigs: [[url: 'https://github.com/Eustachekamala/Virunga']]
            )

            withCredentials([
                usernamePassword(
                    credentialsId: 'virunga_app_db_credentials',
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD'
                   )
            ]) {
                sh 'cd product-service && mvn clean install'
            }
        }
    }

    stage('Build Docker Image') {
        steps {
            sh 'cd product-service && docker build -t eustachekamala/virunga-product-app .'
        }
    }

    stage('Push Docker Image to Docker Hub'){
        steps {
            withCredentials([
                usernamePassword(
                    credentialsId: 'dockerhub_credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )
            ]) {
                sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push eustachekamala/virunga-product-app
                '''
            }
        }
    }
  }
}
