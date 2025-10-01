package mainfiles.mapper;

import mainfiles.dto.UserDTO;
import mainfiles.entity.User;

public class UserMapper {

    // map entity to dto
    public static UserDTO mapToUserDTO(User user) {

        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail()
        );


    }
}
