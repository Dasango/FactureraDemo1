package com.facturera.service;

import com.facturera.model.User;
import com.facturera.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setProvider(User.AuthProvider.LOCAL);
        return userRepository.save(user);
    }
}
