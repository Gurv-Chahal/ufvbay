package mainfiles.utility;

import lombok.RequiredArgsConstructor;
import mainfiles.entity.User;
import mainfiles.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component

// bean injection into spring context wasnt working so used RequiredArgsConstructor instead
@RequiredArgsConstructor
public class UserUtil {

    private final UserRepository userRepository;

    public Long getCurrentUserId() {

        // retrieve authentication object and from that get the username
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // find the user by username or email in database
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new RuntimeException("User not found with username or email: " + username));

        // return id of authenticated user
        return user.getId();
    }
}
