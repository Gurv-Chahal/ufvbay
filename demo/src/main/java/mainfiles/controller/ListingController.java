package mainfiles.controller;

import lombok.AllArgsConstructor;
import mainfiles.dto.ListingDTO;
import mainfiles.dto.UserDTO;
import mainfiles.entity.User;
import mainfiles.mapper.UserMapper;
import mainfiles.repository.ListingRepository;
import mainfiles.repository.UserRepository;
import mainfiles.service.ListingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import mainfiles.utility.UserUtil;
import org.springframework.web.multipart.MultipartFile;

// to access createlisting make sure to put JWT token from logging in into the bearer token field for createlisting api
// this way it associates the jwt token for an account to a listing

@RestController
@RequestMapping("/bay/api/listings")
@CrossOrigin("*")
@AllArgsConstructor
public class ListingController {

    // fields are injected into spring context using constructor injection
    private final ListingService listingService;
    private final UserUtil userUtil;
    private final UserRepository userRepository;


    // Create Listing api
    @PostMapping
    // responseentity returns HTTP response, response contains type ListingDTO
    public ResponseEntity<ListingDTO> createListing(
            //ModelAttribute binds listingDTO parameter to data from object
            @ModelAttribute ListingDTO listingDTO,
            // requestparam is used here to bind "images" to images variable
            // MultiPartFile[] is an array of objects representing uploaded image files
            @RequestParam("images") MultipartFile[] images) {
        try {

            // call createlisting impl in service class and store in createdListing
            ListingDTO createdListing = listingService.createListing(listingDTO, images);

            // return response (Example status 201 and the createdListing information)
            return new ResponseEntity<>(createdListing, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Used in Item.jsx to get listing data by product id
    @GetMapping("/{id}")
    public ResponseEntity<ListingDTO> getListingById(@PathVariable Long id) {

        // retrieves listing by id using implementation in ListingServiceImpl
        ListingDTO listing = listingService.getListingById(id);
        return new ResponseEntity<>(listing, HttpStatus.OK);
    }


    // Get All Listings - used in home.jsx
    @GetMapping
    public ResponseEntity<List<ListingDTO>> getAllListings() {

        // retrieve all listings by using implementation of getalllistings in listingserviceImnpl
        List<ListingDTO> listings = listingService.getAllListings();
        return new ResponseEntity<>(listings, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@listingSecurity.isOwner(authentication, #id)")
    public ResponseEntity<ListingDTO> updateListing(@PathVariable Long id, @RequestBody ListingDTO listingDTO) {
        // call update listing implementation
        ListingDTO updatedListing = listingService.updateListing(id, listingDTO);
        return new ResponseEntity<>(updatedListing, HttpStatus.OK);
    }

    // used in Item.jsx
    @DeleteMapping("/{id}")
    @PreAuthorize("@listingSecurity.isOwner(authentication, #id)")
    public ResponseEntity<String> deleteListing(@PathVariable Long id) {
        // calls delete listing method implementation
        listingService.deleteListing(id);
        return new ResponseEntity<>("Listing deleted successfully", HttpStatus.OK);
    }

    @GetMapping("/user")
    // Ensures only authenticated users can access
    @PreAuthorize("isAuthenticated()")
    // used in UserListings.jsx
    public ResponseEntity<List<ListingDTO>> getUserListings() {

        //  get user id
        Long currentUserId = userUtil.getCurrentUserId();

        // then find listings associated with that user id
        List<ListingDTO> listings = listingService.getListingsByUserId(currentUserId);
        return new ResponseEntity<>(listings, HttpStatus.OK);
    }

    @GetMapping("/userinfo")
    @PreAuthorize("isAuthenticated()")
    // Used in accountinfo.jsx
    public ResponseEntity<UserDTO> getUserInfo() {

        // get user id
        Long userId = userUtil.getCurrentUserId();

        // find user data and put it into an object by using user id to query database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // map user entity to UserDTO
        UserDTO userDTO = UserMapper.mapToUserDTO(user);

        // return userDTO to client
        return ResponseEntity.ok(userDTO);
    }

}
