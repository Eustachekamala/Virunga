# OpenJDK 21 image
FROM eclipse-temurin:21-jdk

# Working directory
WORKDIR /virungaApp

# Copy the built jar into the container
COPY target/virunga-app.jar virunga-app.jar

# Expose the port the app runs on
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java", "-jar", "virunga-app.jar"]


