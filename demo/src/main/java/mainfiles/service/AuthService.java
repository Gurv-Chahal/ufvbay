package mainfiles.service;

import mainfiles.dto.*;

/*
This is simply an interface where we are only going to write the method signature
and leave the implementation of the service class. We want two methods for Authentication Service,
the purpose of this class is to hold the signature for register and login method.
*/


public interface AuthService {

  
  public String register(RegisterDTO registerDTO);

  public String login(LoginDTO loginDTO);

} 