package com.springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GameArchiveApplication 
{
	public static void main(String[] args) 
	{
		SpringApplication.run(GameArchiveApplication.class, args);
	}
}
