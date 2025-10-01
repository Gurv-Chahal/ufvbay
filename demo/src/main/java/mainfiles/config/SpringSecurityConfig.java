package mainfiles.config;


import mainfiles.security.JwtAEP;
import mainfiles.security.JwtAuthFilter;
import mainfiles.service.Implementation.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import mainfiles.repository.UserRepository;
import mainfiles.entity.User;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

// Need @Configuration annotation to inject bean into spring context so that spring can take care of class
@Configuration
@EnableMethodSecurity
public class SpringSecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    // JWT fields
    private JwtAEP authEntryPoint;
    private JwtAuthFilter authFilter;

    // contructor used to inject beans from fields
    public SpringSecurityConfig(CustomUserDetailsService userDetailsService,
                                JwtAEP authEntryPoint, JwtAuthFilter authFilter) {
        this.userDetailsService = userDetailsService;
        this.authEntryPoint = authEntryPoint;
        this.authFilter = authFilter;
    }


    // @Bean tells spring to manage the method in spring container
    @Bean
    // static because we don't need an instance of this, PasswordEncoder is imported from Spring
    // because we need to return what type of password encryption we want to use
    public static PasswordEncoder passwordEncoder() {

        // we are using BCrypt because it is strong, simple, and common password encryption
        return new BCryptPasswordEncoder();
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/bay/auth/**").permitAll()

                        // Make ALL GETs under /bay/api public (includes /bay/api/listings and kids)
                        .requestMatchers(HttpMethod.GET, "/bay/api/**").permitAll()

                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex.authenticationEntryPoint(authEntryPoint))
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    // AuthenticationManager is an interface responsible for handling authentication requests
    // AuthenticationConfiguration provides configuration settings related to authentication
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {

        // creates and provides authenticationmanager which allows spring to perform authentication operations
        return configuration.getAuthenticationManager();
    }




    // had to create this to stop CORS error in terminal
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "https://ufvbay-busuy.ondigitalocean.app"  // <-- add this
        ));
        cfg.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","OPTIONS","PATCH"));
        cfg.setAllowedHeaders(Arrays.asList("*"));
        cfg.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", cfg);
        return src;
    }




}
