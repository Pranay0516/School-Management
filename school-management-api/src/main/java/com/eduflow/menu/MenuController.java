package com.eduflow.menu;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/menus") @CrossOrigin(origins="http://localhost:4200") public class MenuController {
 private final MenuRepository repository; public MenuController(MenuRepository repository){this.repository=repository;}
 @GetMapping public List<Menu> all(){return repository.findAll();}
 @GetMapping("/my-access") public List<Menu> forRole(@RequestParam String role){return repository.findByActiveTrueOrderByDisplayOrderAsc().stream().filter(m->m.roles.contains(role)).toList();}
 @PostMapping public Menu create(@RequestBody Menu menu){return repository.save(menu);}
 @PutMapping("/{id}") public Menu update(@PathVariable Long id,@RequestBody Menu input){input.id=id;return repository.save(input);}
}
