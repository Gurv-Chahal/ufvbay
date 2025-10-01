package mainfiles.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// enables builder pattern
@Builder
public class UnreadUserDTO {

    private Long id;
    private String name;
    private String username;
    private String email;
    private int unreadCount;
    private LocalDateTime lastMessageTime;

}
