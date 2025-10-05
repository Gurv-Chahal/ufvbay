package mainfiles.controller;

import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import mainfiles.entity.User;
import mainfiles.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import lombok.AllArgsConstructor;


import mainfiles.service.AuthService;
import mainfiles.dto.*;


/* 
In this class is where we implement the register and login REST api,
this is why its marked @RestController. restcontroller handles http requests
allowing rest apis to function
*/



@RestController
@CrossOrigin("*")
@AllArgsConstructor
@RequestMapping("/bay/auth")
public class AuthController {

  // fields are injected into spring context using contructor injection
  private AuthService authservice;
  private UserRepository userRepository;

  /* 1. Build Register RESTAPI
   method is of type ResponseEntity which is a class provided by spring that represents
   an http response. it allows us to customize http response. In this case we are returning
   a string and a http response.
   @PostMapping - used to HTTP POST, which is sending data to a server
   */

  @PostMapping("/register")
  public ResponseEntity<String> register(@RequestBody RegisterDTO registerDTO) {
    
    /* calls the register method from authservice interface which is implemented in authserviceimpl 'String
    response' holds the message returned by register() method which is in this case "User registered sucessfully" */
    String response = authservice.register(registerDTO);

    // return string from register method and the httpstatus CREATED
    return new ResponseEntity<>(response, HttpStatus.CREATED);
  }




  // 2. Build Login RESTAPI
  @PostMapping("/login")
  public ResponseEntity<JwtAuthResponse> login(@RequestBody LoginDTO loginDTO) {

      // authenticate user and generate JWT token
      String token = authservice.login(loginDTO);

      // Retrieve the user details
      User user = userRepository.findByUsernameOrEmail(
              loginDTO.getUsernameOrEmail(),
              loginDTO.getUsernameOrEmail()
      ).orElseThrow(() -> new UsernameNotFoundException("User not found"));

      // Create JWT Auth Response creates an object containing jwt token and user id
      JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();

      // assign JWT token to accesstoken field
      jwtAuthResponse.setAccessToken(token);
      // assigns users ID to userId field
      jwtAuthResponse.setUserId(user.getId());

      // returns user id and jwt token
      return new ResponseEntity<>(jwtAuthResponse, HttpStatus.OK);
  }


}