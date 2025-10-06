FROM openjdk:21-jdk-slim

WORKDIR /virungaApp

COPY target/virunga-app.jar virunga-product-app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "virungaApp.jar"]

