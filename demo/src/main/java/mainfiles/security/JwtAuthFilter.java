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
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        // Bypass auth endpoints
        if (path.startsWith("/bay/auth") || path.startsWith("/auth")) {
            chain.doFilter(request, response);
            return;
        }

        String token = getTokenFromRequest(request);

        if (!StringUtils.hasText(token)) {
            // No token → don't block; security config will decide (public vs protected)
            chain.doFilter(request, response);
            return;
        }

        try {
            if (jwtToken.validateToken(token)) {
                String username = jwtToken.getUsername(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            } else {
                SecurityContextHolder.clearContext();
            }
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
        }

        chain.doFilter(request, response);
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
