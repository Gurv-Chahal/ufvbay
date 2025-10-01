package mainfiles.controller;

import mainfiles.dto.UserDTO;
import mainfiles.dto.UnreadUserDTO;
import mainfiles.entity.User;
import mainfiles.entity.Message;
import mainfiles.mapper.UserMapper;
import mainfiles.repository.MessageRepository;
import mainfiles.repository.UserRepository;
import mainfiles.utility.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bay/api")
public class UserController {


    // inject userrepository and messagerepository bean into spring context for database ops
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MessageRepository messageRepository;

    private final UserUtil userUtil;

    // inject userutil using constructor
    public UserController(UserUtil userUtil) {
        this.userUtil = userUtil;
    }


    // Endpoint to update user profile
    @PutMapping("/users/update")
    public ResponseEntity<UserDTO> updateUserProfile(@RequestBody UserDTO updatedUserDTO) {

        // retrieve the current logged-in users ID
        Long userId = userUtil.getCurrentUserId();

        // find the user in the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // update user profile fields
        if (updatedUserDTO.getName() != null) { user.setName(updatedUserDTO.getName()); }
        if (updatedUserDTO.getUsername() != null) { user.setUsername(updatedUserDTO.getUsername()); }
        if (updatedUserDTO.getEmail() != null) { user.setEmail(updatedUserDTO.getEmail()); }

        // save updated user to the database
        User updatedUser = userRepository.save(user);

        // map the updated user to a DTO
        UserDTO userDTO = UserMapper.mapToUserDTO(updatedUser);
        return ResponseEntity.ok(userDTO);
    }

    // Endpoint to get all users with their unread message counts
    @GetMapping("/users/unread")
    public List<UnreadUserDTO> getAllUsersWithUnreadCount(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        // retrieve authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        // create a pageable object with the specified page and size
        Pageable pageable = PageRequest.of(page, size);

        // retrieve a paginated list of users from the database
        List<User> users = userRepository.findAll(pageable).getContent();

        // create a list to store the results
        List<UnreadUserDTO> userWithUnreadDTOs = new ArrayList<>();


        // iterate through users using for each loop
        // for each user calculate the number of unread messages from them to the current user
        for (User user : users) {

            if (!user.getUsername().equals(currentUsername)) {

                // Count the unread messages from this user to the current user
                int unreadCount = messageRepository.countUnreadMessages(user.getUsername(), currentUsername);

                // initialize the lastMessageTime
                LocalDateTime lastMessageTime = null;

                // fetch the last message between this user and the current user
                Optional<Message> lastMessage = messageRepository.findTopBySenderNameAndReceiverNameOrderByTimestampDesc(user.getUsername(), currentUsername);

                // if a message exists then set its timestamp
                if (lastMessage.isPresent()) {
                    lastMessageTime = lastMessage.get().getTimestamp();
                }


                UnreadUserDTO dto = new UnreadUserDTO();
                dto.setId(user.getId());
                dto.setName(user.getName());
                dto.setUsername(user.getUsername());
                dto.setEmail(user.getEmail());
                dto.setUnreadCount(unreadCount);
                dto.setLastMessageTime(lastMessageTime);

                // add dto to arraylist
                userWithUnreadDTOs.add(dto);

            }
        }


        // sort the list by lastMessageTime in descending order
        userWithUnreadDTOs.sort(new Comparator<UnreadUserDTO>() {
            @Override
            public int compare(UnreadUserDTO o1, UnreadUserDTO o2) {

                if (o1.getLastMessageTime() == null && o2.getLastMessageTime() == null) {
                    return 0;
                } else if (o1.getLastMessageTime() == null) {
                    return 1;
                } else if (o2.getLastMessageTime() == null) {
                    return -1;
                } else {
                    return o2.getLastMessageTime().compareTo(o1.getLastMessageTime());
                }
            }
        });

        return userWithUnreadDTOs;
    }


    // Endpoint to get all users
    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {

        // retrieve all users from database
        List<User> users = userRepository.findAll();

        // convert user entities to user dto objects
        return users.stream()
                // map ecah use field to dto
                .map(user -> new UserDTO(
                        user.getId(),
                        user.getName(),
                        user.getUsername(),
                        user.getEmail()
                ))
                // collect user dtos in a list
                .collect(Collectors.toList());
    }


    // Get a single user by id (returns id, name, username, email)
    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "User not found: " + id));

        // If you have a mapper, use it; otherwise construct the DTO directly
        UserDTO dto = UserMapper.mapToUserDTO(user);
        // or: new UserDTO(user.getId(), user.getName(), user.getUsername(), user.getEmail());

        return ResponseEntity.ok(dto);
    }

}
