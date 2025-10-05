package mainfiles.mapper;

import mainfiles.dto.ListingDTO;
import mainfiles.entity.Listing;
import mainfiles.entity.User;


import java.util.Collections;

public class ListingMapper {

    // Map entity to DTO
    public static ListingDTO mapToCreateListingDTO(Listing listing) {
        return new ListingDTO(
                listing.getId(),
                listing.getTitle(),
                listing.getSubject(),
                listing.getAmount(),
                listing.getDescription(),
                listing.getUser().getId(),
                listing.getImages(),
                listing.getLongitude(),
                listing.getLatitude(),
                listing.getUser().getUsername()


        );
    }

    // Map DTO to entity
    public static Listing mapToCreateListing(ListingDTO listingDTO, User user) {
        Listing listing = new Listing();
        listing.setId(listingDTO.getId());
        listing.setTitle(listingDTO.getTitle());
        listing.setSubject(listingDTO.getSubject());
        listing.setAmount(listingDTO.getAmount());
        listing.setDescription(listingDTO.getDescription());
        listing.setImages(listingDTO.getImageUrls());
        listing.setLongitude(listingDTO.getLongitude());
        listing.setLatitude(listingDTO.getLatitude());
        listing.setUser(user);

        return listing;
    }
}
