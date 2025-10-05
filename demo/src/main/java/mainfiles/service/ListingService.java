package mainfiles.service;

/*
    Look at AuthService comments for explanation of how this class works. Not the same but similar idea
 */



import mainfiles.dto.ListingDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ListingService {

    ListingDTO createListing(ListingDTO listingDTO, MultipartFile[] images) throws Exception;
    ListingDTO getListingById(Long id);
    List<ListingDTO> getAllListings();
    ListingDTO updateListing(Long id, ListingDTO listingDTO);
    void deleteListing(Long id);
    List<ListingDTO> getListingsByUserId(Long userId);



}
