package bloodfinder.controller;

import bloodfinder.App;
import bloodfinder.model.User;
import bloodfinder.service.AuthService;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;

public class LoginController {

    @FXML private TextField emailField;
    @FXML private PasswordField passwordField;
    @FXML private Label errorLabel;

    private final AuthService authService = AuthService.getInstance();

    @FXML
    public void handleLogin() {
        errorLabel.setText("");
        try {
            User user = authService.login(emailField.getText(), passwordField.getText());
            if (user.isAdmin()) {
                App.navigateTo("admin-panel", emailField);
            } else {
                App.navigateTo("dashboard", emailField);
            }
        } catch (IllegalArgumentException e) {
            showError(e.getMessage());
        }
    }

    @FXML
    public void goToRegister() {
        App.navigateTo("register", emailField);
    }

    @FXML
    public void browseAsGuest() {
        App.navigateTo("donor-search", emailField);
    }

    private void showError(String msg) {
        errorLabel.setStyle("-fx-text-fill: #E74C3C;");
        errorLabel.setText(msg);
    }
}
