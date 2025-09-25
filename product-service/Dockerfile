FROM openjdk:21-jdk-slim

LABEL authors="eustache"

WORKDIR /virungaApp

COPY target/virunga-0.0.1-SNAPSHOT.jar virunga.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "virunga.jar"]

