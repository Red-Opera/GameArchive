package com.springboot.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import com.springboot.model.VisitorCount;

@Controller
public class HomeController 
{
    @GetMapping("/")
    public String home(Model model) 
    {
        model.addAttribute("message", "포트폴리오 갤러리");
        model.addAttribute("selectedCategory", null);
        
        return "home";
    }

    @GetMapping("/support")
    public String support(Model model) 
    {
        model.addAttribute("message", "Support");
        model.addAttribute("visitorCount", new VisitorCount(0, 0)); // 임시로 0으로 설정
        
        return "support";
    }

    @GetMapping("/privacy")
    public String privacy(Model model) 
    {
        model.addAttribute("message", "Privacy Policy");
        
        return "policy/PrivacyPolicy";
    }
}