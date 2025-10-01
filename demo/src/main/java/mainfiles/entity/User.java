package mainfiles.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;


/*
This is an entity which creates a table called User in the database,
the variables are created into columns which is going to be information we want to store.
This class specifically holds the information about all the users in the database. 
*/


// getter and setter lombok
@Getter
@Setter
// constructor lombok
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {


  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false, unique = true)
  private String username;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String password;



  // One to Many relationship with Listing
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Listing> listings = new ArrayList<>();

}
