package mainfiles.repository;

import mainfiles.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/*
    For explanation on how JpaRepository works look at UserRepository class comments.
    This method will be to find books associated with a specific user
 */

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {

    List<Listing> findByUserId(Long userId);

}
