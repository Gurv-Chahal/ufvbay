package mainfiles.repository;

import mainfiles.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  // Check if a username exists
  boolean existsByUsername(String username);

  // check if an email exists
  boolean existsByEmail(String email);

  // find a user by username or email
  Optional<User> findByUsernameOrEmail(String username, String email);

  // Find a user by username
  Optional<User> findByUsername(String username);
}
