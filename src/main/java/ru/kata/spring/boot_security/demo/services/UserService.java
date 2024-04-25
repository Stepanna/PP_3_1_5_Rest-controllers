package com.example.PP_3_1_2_Spring_Boot.service;


import com.example.PP_3_1_2_Spring_Boot.model.User;

import java.util.List;

public interface UserService {
    List<User> listUsers();
    void saveUser(User user);
    User getUser(long id);
    void updateUser(User user);
    void deleteUser(long id);
}
