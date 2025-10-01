package mainfiles.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity

// defines table name and defines the indexes for better performance since messaging needs to be quick
@Table(name = "messages", indexes = {
        @Index(columnList = "senderName"),
        @Index(columnList = "receiverName"),
        @Index(columnList = "timestamp")
})
@Getter
@Setter
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderName;

    private String receiverName;

    @Column(length = 1000)
    private String message;

    // automatically set timestamp when entity is created
    @CreatedDate
    private LocalDateTime timestamp;

    // indicate weather message is read and cannot be null
    @Column(nullable = false)
    private boolean isRead = false;


}
