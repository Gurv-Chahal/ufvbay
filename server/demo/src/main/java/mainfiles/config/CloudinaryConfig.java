package mainfiles.config;

// this class is for Cloudinary api used to upload images on websites
// testing comments

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// @configuration will inject bean into spring context
@Configuration
public class CloudinaryConfig {

    //using @Value to extract data from application.properties file and inject into fields
    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;


    // define cloudinary bean to be managed by spring context
    @Bean
    public Cloudinary cloudinary() {

        // creates an instance and configures it with key value pairs
        // ObjectUtils.asMap is a method provided by Cloudinary to create key value pairs
        Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
        return cloudinary;
    }



}
