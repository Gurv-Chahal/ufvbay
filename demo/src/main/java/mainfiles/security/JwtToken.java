package mainfiles.security;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtToken {

    // injects the JWT secret value from the application.properties file
    @Value("${app.jwt-secret}")
    private String jwtSecret;

    // injects the JWT expiration time from the application.properties file
    @Value("${app.jwt-expiration-milliseconds}")
    private long jwtExpirationDate;

    // method to Generate a JWT token for an authenticated user
    public String generateToken(Authentication authentication) {

        // extracts the username of the authenticated user
        String username = authentication.getName();

        // get current date and time
        Date currentDate = new Date();

        // calculate expiration date
        Date expireDate = new Date(currentDate.getTime() + jwtExpirationDate);

        // creates a JWT token with the username as the subject, sets the issue and expiration dates,
        // and signs it using the specified key
        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .signWith(key())
                .compact();

        return token;
    }

    // private helper method to create and return a signing key for JWT using secret in application.properties
    private Key key() {
        return Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(jwtSecret)
        );
    }

    // Method to extract the username from a JWT token
    public String getUsername(String token) {

        // parses the JWT token, extracts the claims, and retrieves the subject (username)
        Claims claims = Jwts.parser()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();

        // retrieves the subject (username) from the claims
        String username = claims.getSubject();

        return username;
    }

    // method to validate a JWT token
    public boolean validateToken(String token) {

        // Parses the token to ensure it is valid and not tampered with
        Jwts.parser()
                .setSigningKey(key())
                .build()
                .parse(token);

        // if no exceptions are thrown then token is vlad
        return true;
    }


}
