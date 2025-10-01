package mainfiles.dto;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/*
DTO class for listing information in database to make sure the information in database isn't directly accessed
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListingDTO {

    private Long id;
    private String title;
    private String subject;
    private Float amount;
    private String description;
    private Long userId;
    private List<String> imageUrls;
    private Float longitude;
    private Float latitude;
    private String username;
}
