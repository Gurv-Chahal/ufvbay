package mainfiles.config;

import mainfiles.entity.Listing;
import mainfiles.entity.User;
import mainfiles.repository.ListingRepository;
import mainfiles.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;


// mark class to be managed by spring with name "listingSecurity"
@Component("listingSecurity")
public class ListingSecurity {

    // repository for accessing listing data from database
    private final ListingRepository listingRepository;
    // repository for accessing user data from the database
    private final UserRepository userRepository;

    // constructor to inject fields into spring context
    public ListingSecurity(ListingRepository listingRepository, UserRepository userRepository) {
        this.listingRepository = listingRepository;
        this.userRepository = userRepository;
    }

    // method to verify if the authenticated user is the owner of a specific listing
    public boolean isOwner(Authentication authentication, Long listingId) {

        // if user is not authenticated return boolean false
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }


        // retreive the name of the authenticated user
        String username = authentication.getName();


        // fetch user from database based on username
        User user = userRepository.findByUsername(username)
                .orElse(null);


        // if no user found return false
        if (user == null) {
            return false;
        }


        // fetch listing from database based on listing ID
        Listing listing = listingRepository.findById(listingId)
                .orElse(null);


        // if no listing found then return false
        if (listing == null) {
            return false;
        }



        // compare listing owner user id with authenticated user id
        return listing.getUser().getId().equals(user.getId());
    }
}
