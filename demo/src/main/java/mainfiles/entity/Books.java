package mainfiles.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/*
This is an entity which creates a table called book in the database,
the variables are created into columns which is going to be information we want to store.
This class specifically holds the information about all the books in the database. 
*/



// getter and setter lombok
@Getter
@Setter

// constructor lombok
@AllArgsConstructor
@NoArgsConstructor

// label class as JPA Entity meaning its mapped to a table in a relational database
@Entity

// label class as a tabel called book
@Table(name = "Book")
public class Books {
  

  // this will be a column called bookId which automatically increments
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long bookId;


  // column called name, cannot be null
  @Column(nullable = false)
  private String name;


  // column called author, cannot be null
  @Column(nullable = false)
  private String author;


  // column called classes to store which class the book is associated with
  @Column
  private String classes;
  
}
