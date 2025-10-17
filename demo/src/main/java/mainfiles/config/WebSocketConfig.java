//package mainfiles.config;
//
//import mainfiles.security.JwtHandshakeHandler;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.messaging.simp.config.MessageBrokerRegistry;
//import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
//import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
//import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
//
//@Configuration
//// enables websocket message handling, backed by a message broker like STOMP in the frontend
//@EnableWebSocketMessageBroker
//// this interface contains methods for customizing websocket endpoints
//public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
//
//    int randomvariable;
//
//    // must intercept websocket handshake request to authenticate JWT tokens
//    @Autowired
//    private JwtHandshakeHandler jwtHandshakeInterceptor;
//
//
//    //1. Defines websocket endpoints that clients use to connect
//    @Override
//    public void registerStompEndpoints(StompEndpointRegistry registry) {
//
//        // register /ws endpoint, validate JWT token, Allow websocket connect from any origin *
//        registry.addEndpoint("/ws")
//                .addInterceptors(jwtHandshakeInterceptor)
//                .setAllowedOriginPatterns("*")
//                .withSockJS();
//    }
//
//
//    // 2. Configure the message broker to handle message routing
//    @Override
//    public void configureMessageBroker(MessageBrokerRegistry registry) {
//        // prefix for messages sent to server like /app/messages
//        registry.setApplicationDestinationPrefixes("/app");
//        // in memory message broker
//        registry.enableSimpleBroker("/chatroom", "/user");
//        // configure prefix for messages directed to specfic users
//        // like /user/john/private
//        registry.setUserDestinationPrefix("/user");
//    }
//}
