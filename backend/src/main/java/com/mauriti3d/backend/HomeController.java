package com.mauriti3d.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, String> home() {
        return Map.of(
            "status", "online",
            "app", "Mauriti3D API",
            "version", "1.0.0"
        );
    }
}
