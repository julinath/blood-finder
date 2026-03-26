package bloodfinder.service;

import bloodfinder.model.User;
import bloodfinder.repository.UserRepository;
import bloodfinder.util.ValidationUtil;

/**
 * Singleton Pattern — only one AuthService instance exists.
 * Handles Login, Registration, and Session management.
 */
public class AuthService {

    private static AuthService instance;
    private final UserRepository userRepository;
    private User loggedInUser;

    private AuthService() {
        this.userRepository = new UserRepository();
    }

    public static synchronized AuthService getInstance() {
        if (instance == null) {
            instance = new AuthService();
        }
        return instance;
    }

    /**
     * @throws IllegalArgumentException with a message if validation fails
     */
    public User register(String name, String email, String password, String mobile, String location) {
        if (!ValidationUtil.isNotEmpty(name, email, password, mobile, location))
            throw new IllegalArgumentException("All fields are required.");
        if (!ValidationUtil.isValidEmail(email))
            throw new IllegalArgumentException("Enter a valid email address.");
        if (password.length() < 6)
            throw new IllegalArgumentException("Password must be at least 6 characters.");
        if (!ValidationUtil.isValidMobile(mobile))
            throw new IllegalArgumentException("Enter a valid mobile number (10-15 digits).");
        if (userRepository.existsByEmail(email.trim().toLowerCase()))
            throw new IllegalArgumentException("An account with this email already exists.");

        User user = new User(name.trim(), email.trim().toLowerCase(), password, mobile.trim(), location.trim());
        userRepository.save(user);
        return user;
    }

    /**
     * @throws IllegalArgumentException if login fails
     */
    public User login(String email, String password) {
        if (!ValidationUtil.isNotEmpty(email, password))
            throw new IllegalArgumentException("Please enter your email and password.");

        User user = userRepository.findByEmail(email.trim().toLowerCase());
        if (user == null || !user.getPassword().equals(password))
            throw new IllegalArgumentException("Incorrect email or password.");

        this.loggedInUser = user;
        return user;
    }

    public void logout() {
        this.loggedInUser = null;
    }

    public User getLoggedInUser() {
        return loggedInUser;
    }

    public boolean isLoggedIn() {
        return loggedInUser != null;
    }

    public void updateProfile(String mobile, String location) {
        if (loggedInUser == null) throw new IllegalStateException("Not logged in");
        loggedInUser.setMobile(mobile);
        loggedInUser.setLocation(location);
        userRepository.update(loggedInUser);
    }
}
