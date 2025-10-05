package mainfiles.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity

// specifies table name and ensures the combination of sender/reciever is unique
@Table(name = "read_receipts", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"sender_id", "receiver_id"})
})
@Getter
@Setter
public class ReadReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User who sent messages
    @ManyToOne(fetch = FetchType.LAZY)
    // specify foreign key
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    // User who received messages
    @ManyToOne(fetch = FetchType.LAZY)
    // specify foreign key
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    // timestamp of the last read action
    @Column(nullable = false)
    private LocalDateTime lastReadAt;

    // Constructors
    public ReadReceipt() {
    }

    public ReadReceipt(User sender, User receiver, LocalDateTime lastReadAt) {
        this.sender = sender;
        this.receiver = receiver;
        this.lastReadAt = lastReadAt;
    }
}
