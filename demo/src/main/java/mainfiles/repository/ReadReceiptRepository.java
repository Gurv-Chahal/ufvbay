package mainfiles.repository;

import mainfiles.entity.ReadReceipt;
import mainfiles.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReadReceiptRepository extends JpaRepository<ReadReceipt, Long> {
    Optional<ReadReceipt> findBySenderAndReceiver(User sender, User receiver);
}
