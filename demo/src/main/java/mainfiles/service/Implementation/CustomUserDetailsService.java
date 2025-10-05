package mainfiles.service.Implementation;


import lombok.AllArgsConstructor;
import mainfiles.entity.User;
import mainfiles.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/*
I'm going to add explanation here because this is complicated and important as to how login works.

Summary: this class is important for login authentication. it gets the username, email, password from the database
so that it can be authenticated in SpringSecurityConfig class

UserDetailsService - this is an interface in spring security which has a method called loadUserByUsername
which retrieves user information such as username, password, and what level of authority (admin, etc) it has. It retrieves
this from the database.

CustomUserDetailsService - this is an implementation of the UserDetailsService interface. It gets a user entity
from the database and it finds the username or email which is then stored in 'User user'

 */




@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private UserRepository userRepository;

    // method is from UserDetailsService interface provided by spring
    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {

        // Fetch user by username or email
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException
                        ("User not found with username or email: " + usernameOrEmail));

        // assign default role using GrantedAuthority which is Spring interface
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_ADMIN");

        // create a new ArrayList to hold authorities
        List<GrantedAuthority> authorities = new ArrayList<>();

        // Add the authority to the list
        authorities.add(authority);

        // return UserDetails implementation with default authority
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                authorities
        );

    }
}
