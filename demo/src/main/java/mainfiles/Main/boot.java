package mainfiles.Main;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication

// issues of error 404, and issues of error 500 nullpointerexception were fixed
// by entityscan, componentscan, enablejparepositories. As well as other issues
// almost all issues have been fixed by using component scan
@EntityScan("mainfiles.entity")
@ComponentScan(basePackages = {"mainfiles.controller", "mainfiles.service", "mainfiles.config",
								"mainfiles.security", "mainfiles.repository", "mainfiles.utility",
								})
@EnableJpaRepositories(basePackages = {"mainfiles.repository"})

public class boot {

	public static void main(String[] args) {
		SpringApplication.run(boot.class, args);
	}

}

