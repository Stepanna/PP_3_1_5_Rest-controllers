package ru.kata.spring.boot_security.demo.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;


public interface UserService extends UserDetailsService {
    List<User> listUsers();
    void saveUser(User user);
    User getUser(long id);
    void updateUser(User user);
    void deleteUser(long id);
    public User findByUsername(String username);
    public UserDetails loadUserByUsername(String username);
}
