package mainfiles.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
// custom filer that runs every request to validate JWT token
public class JwtAuthFilter extends OncePerRequestFilter {

    // fields are injected using constructor injection
    private final JwtToken jwtToken;
    private final UserDetailsService userDetailsService;

    public JwtAuthFilter(JwtToken jwtToken, UserDetailsService userDetailsService) {
        this.jwtToken = jwtToken;
        this.userDetailsService = userDetailsService;
    }


    // Processes each incoming http request and validate JWT
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // get URI
        String path = request.getRequestURI();

        // bypass JWT processing for /auth/** endpoints as stated in SpringSecurityConfig class
        if (path.startsWith("/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // extract jwt from authorization header given in api request from frontend
        String token  = getTokenFromRequest(request);
        System.out.println("Processing token: " + token);

        // if token is not empty
        if (StringUtils.hasText(token)) {

            try {
                // if token is validated
                if (jwtToken.validateToken(token)) {

                    // get username from token
                    String username = jwtToken.getUsername(token);
                    System.out.println("Valid token for user: " + username);

                    // get user details from token
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );

                    // create authenitcation token from user details
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);

                    // if token is not validated
                } else {
                    System.out.println("Invalid token.");
                }
            } catch (Exception e) {
                System.out.println("Token validation error: " + e.getMessage());
            }
            // if no token is found and empty
        } else {
            System.out.println("No token found in request.");
        }

        // continue filter chain by passing request and response to next filter
        filterChain.doFilter(request, response);
    }



    // this is to extract token from authorization header like the ones in api requests in AuthService.js
    private String getTokenFromRequest(HttpServletRequest request) {

        // get value of authorization header
        String bearerToken = request.getHeader("Authorization");

        // check if header contains a correct token format starting with bearer
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            // retrn token excluding bearer in front
            return bearerToken.substring(7);
        }

        // otherwise return null
        return null;
    }
}
