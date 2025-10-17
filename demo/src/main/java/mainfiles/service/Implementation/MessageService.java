//// src/main/java/mainfiles/service/Implementation/MessageService.java
//
//package mainfiles.service.Implementation;
//
//import mainfiles.entity.Message;
//import mainfiles.entity.ReadReceipt;
//import mainfiles.entity.User;
//import mainfiles.repository.MessageRepository;
//import mainfiles.repository.ReadReceiptRepository;
//import mainfiles.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class MessageService {
//
//    // Inject repository interfaces for database operations
//    private final MessageRepository messageRepository;
//    private final ReadReceiptRepository readReceiptRepository;
//    private final UserRepository userRepository;
//
//    @Autowired
//    public MessageService(MessageRepository messageRepository,
//                          ReadReceiptRepository readReceiptRepository,
//                          UserRepository userRepository) {
//        this.messageRepository = messageRepository;
//        this.readReceiptRepository = readReceiptRepository;
//        this.userRepository = userRepository;
//    }
//
//    // 1. save the message entity to the database and set timestamp
//    @Transactional
//    public Message saveMessage(Message message) {
//
//        // add current time as timestamp
//        message.setTimestamp(LocalDateTime.now());
//        // set read flag to false by default
//        message.setRead(false);
//
//        // save message to the database using JPA
//        Message savedMessage = messageRepository.save(message);
//        System.out.println("Saved message: " + savedMessage);
//        return savedMessage;
//    }
//
//    // 2. fetch messages sent by a specific user
//    public Page<Message> getMessagesBySender(String senderName, Pageable pageable) {
//        // calls query in repository to fetch messages where senderName matches
//        return messageRepository.findBySenderName(senderName, pageable);
//    }
//
//    // 3. fetch messages received by a specific user
//    public Page<Message> getMessagesByReceiver(String receiverName, Pageable pageable) {
//        // use query in repository to fetch messages where receiverName matches
//        return messageRepository.findByReceiverName(receiverName, pageable);
//    }
//
//
//    // 5. fetch full conversation between two users
//    public List<Message> getFullConversationBetweenUsers(String user1, String user2) {
//        // call a query in the repository to fetch all messages exchanged between the two users
//        return messageRepository.findFullConversationBetweenUsers(user1, user2);
//    }
//
//
//
//    // 7. marks messages from a sender to a receiver as read
//    // and updates/creates readrecipet entry in database
//    @Transactional
//    public int markMessagesAsRead(String senderUsername, String receiverUsername) {
//
//
//        // mark messages as read in the database
//        int updated = messageRepository.markMessagesAsRead(senderUsername, receiverUsername);
//
//        // fetch sender and reciever users from the database
//        Optional<User> senderOpt = userRepository.findByUsername(senderUsername);
//        Optional<User> receiverOpt = userRepository.findByUsername(receiverUsername);
//
//        // if both sender and reciever exist
//        if (senderOpt.isPresent() && receiverOpt.isPresent()) {
//
//            // get the sender and reciever
//            User sender = senderOpt.get();
//            User receiver = receiverOpt.get();
//
//            // check if a readreceipt already exists for pair of users
//            Optional<ReadReceipt> receiptOpt = readReceiptRepository.findBySenderAndReceiver(sender, receiver);
//
//            // if it exists
//            if (receiptOpt.isPresent()) {
//
//                // update timestamp
//                ReadReceipt receipt = receiptOpt.get();
//                receipt.setLastReadAt(LocalDateTime.now());
//
//                // save to database
//                readReceiptRepository.save(receipt);
//
//                // if it doesnt exist
//            } else {
//                // create a new readreceipt and store in database using timestamp
//                ReadReceipt newReceipt = new ReadReceipt(sender, receiver, LocalDateTime.now());
//                readReceiptRepository.save(newReceipt);
//            }
//        }
//
//        return updated;
//    }
//
//
//
//}
