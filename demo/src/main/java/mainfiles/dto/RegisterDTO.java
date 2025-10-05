package mainfiles.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/* 
The purpose of the DTO class is to essentially encapsulate the entities because 
we dont want to directly interact with the database, it is better to keep it hidden.
The DTO class will only give the information we need from database, which is good.
*/

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDTO {

  // information we want sent back and forth from the database so that the user can register
  private String name;
  private String username;
  private String password;
  private String email;

}