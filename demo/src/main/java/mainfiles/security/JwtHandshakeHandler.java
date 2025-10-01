package mainfiles.security;

import mainfiles.security.JwtToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Component
// this class is to validate JWT tokens intercepted ffrom websocket requests
public class JwtHandshakeHandler implements HandshakeInterceptor {

    // inject jwtToken field into spring context
    @Autowired
    private JwtToken jwtToken;


    // this method is executed before websocket handshake is finished
    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) {

        // get the query string from websocket handshare request
        String query = request.getURI().getQuery();

        // if query parameters are not null
        if (query != null) {

            // parse query parameters into a map using UriComponentsBuilder which is a built in spring web dependency
            Map<String, List<String>> queryParams = UriComponentsBuilder.fromUriString("?" + query).build().getQueryParams();

            // get token parameter from query parameters
            List<String> tokenList = queryParams.get("token");

            // if token parameters are present and not empty
            if (tokenList != null && !tokenList.isEmpty()) {

                // retrieve the first token from the list
                String token = tokenList.get(0);

                // validate token using validateToken method in JwtToken class
                if (jwtToken.validateToken(token)) {

                    // extract username from token
                    String username = jwtToken.getUsername(token);
                    // add authenticated username to websocket attribute
                    attributes.put("username", username);

                    return true;

                } else {
                    System.out.println("Invalid token");
                }
            } else {
                System.out.println("No token found in query params");
            }
        } else {
            System.out.println("No query params in handshake request");
        }

        // return false if websocket handshake is not valid
        return false;
    }

    // must be implemented because its in the HandshakeInterceptor
    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception
    ) {

    }
}
