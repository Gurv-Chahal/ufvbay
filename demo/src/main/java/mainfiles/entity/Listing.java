package mainfiles.entity;

import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "listings")
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private float amount;

    private String description;

    @Column(nullable = true)
    private Float longitude;

    @Column(nullable=true)
    private Float latitude;

    // element collection specifies image urls to be stored in a different table
    @ElementCollection
    // new table is called listing_images and it joins columns with listing_id which is a foreign key`
    @CollectionTable(name = "listing_images", joinColumns = @JoinColumn(name = "listing_id"))
    @Column(name = "image_url")
    // stores image urls from Cloudinary as Strings in database
    private List<String> images;


    // many to One relationship with User and only loads user from database if specifically asked
    @ManyToOne(fetch = FetchType.LAZY)
    // join user_id column in database table which is a foriegn key that links listings and users
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
