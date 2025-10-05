package mainfiles.service.Implementation;

import lombok.RequiredArgsConstructor;
import mainfiles.security.JwtToken;
import mainfiles.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import mainfiles.entity.User;

import lombok.AllArgsConstructor;
import mainfiles.dto.*;
import mainfiles.repository.*;


/*
The purpose of the service class is to write the actual implementation of the code/business logic.
This class is called AuthServiceImpl because we will writing the implementation of the authentication logic,
Meaning the implementation of login/registration.
*/

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  /* has functionality such as checking if username/email already exists in database
   UserRepository is a class which extends JPARepository built in method.
   Here we have a reference to an object of the class UserRepository */
  private final UserRepository userRepository;

  // gives methods to encrypt passwords
  private final PasswordEncoder passwordEncoder;

  // gives methods to authenticate login
  private final AuthenticationManager authenticationManager;

  //JWT field
  private final JwtToken jwtToken;



  // have reference to an object of the class RegisterDTO
  @Override
  public String register(RegisterDTO registerDTO) {
    
    /* 1. Check if username already exists in database by using UserRepository
     in () we access registerDTO class then using . operator we get the getter method to private username field */
    if (userRepository.existsByUsername(registerDTO.getUsername())) {
      // when invalid parameters are passed we should throw a runtime exception
      throw new RuntimeException("This Username has already been taken");
    }

    /* 2. check if email already exists in the database by using UserRepository
     in () we access registerDTO class then using . operator we get the getter method to private email field */
    if (userRepository.existsByEmail(registerDTO.getEmail())) {
      // when invalid parameters are passed we should throw a runtime exception
      throw new RuntimeException("This email is already in use");
    }

    // create instance of User class called user
    User user = new User();



    /* call getUsername on registerDTO object to retrieve the username user has entered during
    registration. Then pass this username to setUsername method which will then update it
    in user entity, which then maps it to the database. */
    user.setUsername(registerDTO.getUsername());


    // passwordEncoder encrypts the password in the database so that it cant be seen by anyone
    user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));

    user.setEmail(registerDTO.getEmail());

    user.setName(registerDTO.getName());


    // 1. checks if the user is a new entity or existing one.
    // 2. insert or update the record in the users table in the database based on the properties of the user object
    userRepository.save(user);

    // In register method
    System.out.println("Registering user: " + registerDTO.getUsername() + ", Email: " + registerDTO.getEmail());



    return "User registered sucessfully";
  }



  @Override
  public String login(LoginDTO loginDTO) {

    /* using authenticationManager we call authenticate method, inside the parameters we call
    UsernamePasswordAuthenticationToken which stores user credentials and holds authenticated user details
    then we put all this information in authentication variable */
    Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
            loginDTO.getUsernameOrEmail(),
            loginDTO.getPassword()
    ));

    /* SecurityContextHolder stores security details like the authenticated user.
    getContext() retrieves the context, and setAuthentication(authentication) saves the user's authentication info. */
    SecurityContextHolder.getContext().setAuthentication(authentication);

    // JWT code
    String token = jwtToken.generateToken(authentication);



    

    return token;
  }
  
}
