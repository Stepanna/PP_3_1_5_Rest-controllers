package ru.kata.spring.boot_security.demo.utils;

import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Set;

@Component
public class InitApplication {
    private final UserService userService;
    private final RoleService roleService;

    public InitApplication(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

//    id, username, password, name, last_name, age

    @PostConstruct
    private void defaultAdminAndUser() {
        Role defaultAdmin = new Role("ROLE_ADMIN");
        Role defaultUser = new Role("ROLE_USER");
        Set<Role> rolesAdmin = new HashSet<>();
        Set<Role> rolesUser = new HashSet<>();
        rolesAdmin.add(defaultAdmin);
        rolesUser.add(defaultUser);
        User admin = new User("admin", "password",
                "admin", "admin", (byte) 35, rolesAdmin);
        User user = new User("user", "password",
                "user", "user", (byte) 35, rolesUser);
        roleService.save(defaultAdmin);
        roleService.save(defaultUser);
        userService.saveUser(admin);
        userService.saveUser(user);
    }
}
