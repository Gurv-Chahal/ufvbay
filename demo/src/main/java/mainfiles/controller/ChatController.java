//package mainfiles.controller;
//
//import mainfiles.entity.Message;
//import mainfiles.service.Implementation.MessageService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.domain.Sort;
//import org.springframework.http.ResponseEntity;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.Payload;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.ArrayList;
//import java.util.List;
//
//// Controller handles communication between WebSockets and frontend API requests
//@Controller
//public class ChatController {
//
//    // SimpMessagingTemplate is part of Spring and used to send WebSocket messages
//    // using @autowired to directly inject field into spring context
//    @Autowired
//    private SimpMessagingTemplate simpMessagingTemplate;
//
//    // Injecting MessageService class as a field, MessageService handles message operations
//    @Autowired
//    private MessageService messageService;
//
//
//
//    // Handles private messages between users and ensures both sender and receiver see messages
//    @MessageMapping("/private-message")
//    // extract payload of websocket message into message variable
//    public void sendPrivateMessage(@Payload Message message) {
//        // save message in database and assign to savedMessage
//        Message savedMessage = messageService.saveMessage(message);
//        // Send the message to the private reciever in channel /user/{username}/private
//        simpMessagingTemplate.convertAndSendToUser(savedMessage.getReceiverName(), "/private", savedMessage);
//        // also send back to sender to update the local user interface
//        simpMessagingTemplate.convertAndSendToUser(savedMessage.getSenderName(), "/private", savedMessage);
//    }
//
//
//
//    // Fetch all messages sent and received for authenticated user
//    @GetMapping("/api/messages")
//    // used responsebody to indicate that retrn value should be written into the http response
//    @ResponseBody
//    public List<Message> getUserMessages(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "50") int size) {
//
//
//        // retrieve current authenticated user details then get the users name from that
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String username = authentication.getName();
//
//        // retrieves page object with specified page, size, and sorts it by timestamp
//        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
//
//        // retrieves page of messages recieved by the authenticated user
//        Page<Message> receivedMessages = messageService.getMessagesByReceiver(username, pageable);
//
//        // retrieves page of messages sent by the authenticated user
//        Page<Message> sentMessages = messageService.getMessagesBySender(username, pageable);
//
//        //Create list to hold all messages for the user
//        List<Message> allMessages = new ArrayList<>();
//
//        // add sent and recieved messages to the list
//        allMessages.addAll(receivedMessages.getContent());
//        allMessages.addAll(sentMessages.getContent());
//
//        // sort all messages by timestamp in descending order
//        allMessages.sort((m1, m2) -> m2.getTimestamp().compareTo(m1.getTimestamp()));
//
//        // return combined and sorted messages arraylist
//        return allMessages;
//    }
//
//    // Fetch conversation between two users
//    @GetMapping("/api/conversation/{user2}")
//    @ResponseBody
//    public List<Message> getConversation(@PathVariable String user2) {
//
//        // retrieves authenticated user details then from that retrieves the name
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String user1 = authentication.getName();
//
//        // gets full conversation between authenticated user and the other specified user
//        List<Message> conversation = messageService.getFullConversationBetweenUsers(user1, user2);
//
//        System.out.println("Fetched full conversation between " + user1 + " and " + user2 + ": " + conversation.size() + " messages");
//
//        // mark messages from user2 to user1 as read
//        messageService.markMessagesAsRead(user2, user1);
//
//        return conversation;
//    }
//
//
//    // Endpoint to mark messages from a sender as read by the receiver
//    @PostMapping("/api/messages/mark-read")
//    @ResponseBody
//    public ResponseEntity<String> markMessagesAsRead(@RequestParam String sender) {
//
//        // retrieve currnt authenticated user details and then gets the name from that
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String receiver = authentication.getName();
//
//        // marks messages from sender to authenticated user as read and returns count of updates messages
//        int updated = messageService.markMessagesAsRead(sender, receiver);
//
//        // check if any messages were updated
//        if(updated > 0){
//            return ResponseEntity.ok("Marked " + updated + " messages as read.");
//        }
//        return ResponseEntity.ok("No unread messages to mark as read.");
//    }
//
//}
