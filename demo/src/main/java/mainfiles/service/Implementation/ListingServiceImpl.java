package mainfiles.service.Implementation;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.AllArgsConstructor;
import mainfiles.dto.ListingDTO;
import mainfiles.entity.Listing;
import mainfiles.mapper.ListingMapper;
import mainfiles.repository.ListingRepository;
import mainfiles.repository.UserRepository;
import mainfiles.service.ListingService;
import mainfiles.utility.UserUtil;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import mainfiles.entity.User;
import org.springframework.web.multipart.MultipartFile;


@Service
@AllArgsConstructor
public class ListingServiceImpl implements ListingService {

    // fields are injected into Spring context using constructor injection
    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final UserUtil userUtil;
    private final Cloudinary cloudinary;


    // 1. Create Listing implementation
    @Override
    public ListingDTO createListing(ListingDTO listingDTO, MultipartFile[] images) throws Exception {

        // 1.Get current user
        Long currentUserId = userUtil.getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + currentUserId));

        // 2.Handle image uploads
        // Hold a list of image Urls in an arraylist of type string
        List<String> imageUrls = new ArrayList<>();

        // check to see if there are images to upload (i.e not null and > 0)
        if (images != null && images.length > 0) {

            // using a for each loop, iterate over each image
            for (MultipartFile image : images) {

                // make sure image file is not empty
                if (!image.isEmpty()) {
                    try {
                        // Upload image to Cloudinary
                        Map uploadResult = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.emptyMap());
                        // extract the url and store it in database
                        String imageUrl = uploadResult.get("secure_url").toString();
                        // add the url to imageUrls arraylist
                        imageUrls.add(imageUrl);
                    } catch (IOException e) {
                        // throw exception if image fails to upload
                        throw new Exception("Failed to upload image: " + image.getOriginalFilename(), e);
                    }
                }
            }
        }

        // pass the arraylist of image url strings to listingDTO object
        listingDTO.setImageUrls(imageUrls);

        // Map DTO to entity
        Listing listing = ListingMapper.mapToCreateListing(listingDTO, user);

        // now that its an entity type again it can be saved to the database
        Listing savedListing = listingRepository.save(listing);

        // Map entity back to DTO so it can be returned back to the frontend
        return ListingMapper.mapToCreateListingDTO(savedListing);
    }



    @Override
    // 2. Get a specific listing using listing id
    public ListingDTO getListingById(Long id) {
        // using jpa repo method, query database to find listing with specific id
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found with id: " + id));

        // return that listing but first map to DTO
        return ListingMapper.mapToCreateListingDTO(listing);
    }

    @Override
    // 3. method will return a list of ListingDTO objects
    public List<ListingDTO> getAllListings() {

        // holds a list of Listing objects which is equal to findall which retrieves all records
        // of listings from the listing table in database
        List<Listing> listings = listingRepository.findAll();

        List<ListingDTO> listingDTOs = new ArrayList<>();

        // iterate over listings
        for (Listing listing : listings) {
            // map each listing into dto
            ListingDTO dto = ListingMapper.mapToCreateListingDTO(listing);
            // add each listing to arraylist
            listingDTOs.add(dto);
        }

        // return arraylist of listings
        return listingDTOs;
    }

    @Override
    // 4. update a specific listing
    public ListingDTO updateListing(Long id, ListingDTO listingDTO) {

        // find listing by querying database using findById to find specific lsting
        Listing existingListing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found with id: " + id));


        // use setter methods to change anything about the listing
        existingListing.setTitle(listingDTO.getTitle());
        existingListing.setSubject(listingDTO.getSubject());
        existingListing.setAmount(listingDTO.getAmount());
        existingListing.setDescription(listingDTO.getDescription());
        existingListing.setImages(listingDTO.getImageUrls());
        existingListing.setLatitude(listingDTO.getLongitude());
        existingListing.setLatitude(listingDTO.getLatitude());



        // save the updated listing to the database
        Listing updatedListing = listingRepository.save(existingListing);

        // return the updated listing as DTO so it can be returned to client
        return ListingMapper.mapToCreateListingDTO(updatedListing);
    }


    // 5. delete listing implementation
    @Override
    public void deleteListing(Long id) {

        // retrieves listing object from database using id
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found with id: " + id));

        // remove listing from database
        listingRepository.delete(listing);
    }


    @Override
    // 6. get listing by user id
    public List<ListingDTO> getListingsByUserId(Long userId) {

        // query database through user id to find listings and put them into List
        List<Listing> listings = listingRepository.findByUserId(userId);

        List<ListingDTO> listingDTOs = new ArrayList<>();

        // iterate through each listing in the list
        for (Listing listing : listings) {

            // map into dto
            ListingDTO dto = ListingMapper.mapToCreateListingDTO(listing);

            // add to new arraylist
            listingDTOs.add(dto);
        }

        // return arraylist of listings with them converting to DTO
        return listingDTOs;
    }

}
