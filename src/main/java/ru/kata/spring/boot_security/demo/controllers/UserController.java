package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
public class UserController {

    private final UserService userService;
    private final RoleService roleService;
    PasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserController(UserService userService, RoleService roleService, PasswordEncoder bCryptPasswordEncoder) {
        this.userService = userService;
        this.roleService = roleService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @GetMapping("/list_users")
    public ResponseEntity<?> getUsersList(/*@ModelAttribute("user") User user*/) {
        try {
            List<User> users = userService.listUsers();
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/list_roles")
    public ResponseEntity<?> getRolesList() {
        try {
            List<Role> roles = roleService.listRoles();
            return new ResponseEntity<>(roles, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/new")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            userService.saveUser(user);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    @PatchMapping("/edit/{id}")
    public ResponseEntity<?> editUser(@PathVariable Long id, @RequestBody User user) {
        try {
            Optional<User> optionalUser = Optional.ofNullable(userService.getUser(id));
            if (optionalUser.isPresent()) {
                userService.updateUser(user);
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                throw new UsernameNotFoundException("User not found with id: " + id);
            }
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    @DeleteMapping("/delete/{id}") // admin only
    public ResponseEntity<?> deleteUser(@PathVariable("id") Long id) {
        try {
            Optional<User> optionalUser = Optional.ofNullable(userService.getUser(id));
            if (optionalUser.isPresent()) {
                userService.deleteUser(id);
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                throw new UsernameNotFoundException("User not found with id: " + id);
            }
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/current_user") //for users
    public ResponseEntity<?> getCurrentUser(Model model, Principal principal) {
        try {
            User user = userService.findByUsername(principal.getName());
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserInfo(@PathVariable("id") Long id){
        try {
            Optional<User> optionalUser = Optional.ofNullable(userService.getUser(id));
            if (optionalUser.isPresent()) {
                return new ResponseEntity<>(optionalUser.get(), HttpStatus.OK);
            } else {
                throw new UsernameNotFoundException("User not found with id: " + id);
            }
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
