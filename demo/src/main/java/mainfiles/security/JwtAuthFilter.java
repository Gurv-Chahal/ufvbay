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
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        // Use servlet path for matching (cleaner)
        String path = req.getServletPath();

        // Bypass auth endpoints
        if (path.startsWith("/bay/auth") || path.startsWith("/auth")) {
            chain.doFilter(req, res);
            return;
        }

        // If no token → just continue; public GETs will be permitted by the rules above
        String token = getTokenFromRequest(req);
        if (!org.springframework.util.StringUtils.hasText(token)) {
            chain.doFilter(req, res);
            return;
        }

        try {
            if (jwtToken.validateToken(token)) {
                String username = jwtToken.getUsername(token);
                var ud = userDetailsService.loadUserByUsername(username);
                var auth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        ud, null, ud.getAuthorities());
                auth.setDetails(new org.springframework.security.web.authentication.WebAuthenticationDetailsSource().buildDetails(req));
                org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(auth);
            } else {
                org.springframework.security.core.context.SecurityContextHolder.clearContext();
            }
        } catch (Exception e) {
            org.springframework.security.core.context.SecurityContextHolder.clearContext();
        }

        chain.doFilter(req, res);
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
