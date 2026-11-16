FROM node:24-alpine AS frontend-build
WORKDIR /workspace/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace

COPY backend/ ./backend/
COPY --from=frontend-build /workspace/frontend/dist/frontend/browser/ ./backend/src/main/resources/static/
RUN chmod +x backend/mvnw
RUN ./backend/mvnw -f backend/pom.xml -q -DskipTests package

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

COPY --from=build /workspace/backend/target/*.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
