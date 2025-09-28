FROM openjdk:21-jdk-slim

WORKDIR /virungaApp

COPY target/virunga-0.0.1-SNAPSHOT.jar virungaApp.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "virungaApp.jar"]

