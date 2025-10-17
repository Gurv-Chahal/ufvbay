//// src/main/java/mainfiles/repository/MessageRepository.java
//
//package mainfiles.repository;
//
//import jakarta.transaction.Transactional;
//import mainfiles.entity.Message;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Modifying;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//import java.util.Optional;
//
//// Repository interface for interacting with the Message entity
//@Repository
//public interface MessageRepository extends JpaRepository<Message, Long> {
//
//    // fetches all messages sent by a user with pagination
//    Page<Message> findBySenderName(String senderName, Pageable pageable);
//
//    // fetches all messages received by a user with pagination
//    Page<Message> findByReceiverName(String receiverName, Pageable pageable);
//
//
//    // Fetches the full conversation between two users ordered by timestamp, returns list of messages exchanged
//    @Query("SELECT m FROM Message m WHERE " +
//            "(m.senderName = :user1 AND m.receiverName = :user2) OR " +
//            "(m.senderName = :user2 AND m.receiverName = :user1) " +
//            "ORDER BY m.timestamp ASC")
//    List<Message> findFullConversationBetweenUsers(@Param("user1") String user1, @Param("user2") String user2);
//
//     // counts the number of unread messages sent by one user to another.
//    @Query("SELECT COUNT(m) FROM Message m WHERE m.senderName = :sender AND m.receiverName = :receiver AND m.isRead = false")
//    int countUnreadMessages(@Param("sender") String sender, @Param("receiver") String receiver);
//
//    // marks all unread messages from a specific sender to a receiver as read.
//    // indicates that this is an update query
//    @Modifying
//    // ensures the operation is part of a transaction
//    @Transactional
//    // update isRead to true if senderName matches sender parameter, recieverName matches reciever parameter and isread is currently false
//    @Query("UPDATE Message m SET m.isRead = true WHERE m.senderName = :sender AND m.receiverName = :receiver AND m.isRead = false")
//    int markMessagesAsRead(@Param("sender") String sender, @Param("receiver") String receiver);
//
//
//    // retrieves the most recent messages sent by a sender to a reiever
//    Optional<Message> findTopBySenderNameAndReceiverNameOrderByTimestampDesc(String senderName, String receiverName);
//}
