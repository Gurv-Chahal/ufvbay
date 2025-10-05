# -------- build stage --------
FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /src
COPY . .
# build a fat jar; skip tests for faster deploys
RUN mvn -q -DskipTests package

# -------- runtime stage --------
FROM eclipse-temurin:17-jre
WORKDIR /app
# copy the jar built above (matches spring-boot: repackage default output)
COPY --from=build /src/target/*.jar app.jar

# DigitalOcean App Platform injects $PORT; bind Spring to it
ENV JAVA_OPTS=""
CMD ["sh", "-c", "java $JAVA_OPTS -Dserver.port=$PORT -jar app.jar"]
