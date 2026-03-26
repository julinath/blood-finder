package bloodfinder.controller;

import bloodfinder.App;
import bloodfinder.service.AuthService;
import bloodfinder.util.AlertUtil;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;

public class RegisterController {

    @FXML private TextField nameField;
    @FXML private TextField emailField;
    @FXML private PasswordField passwordField;
    @FXML private TextField mobileField;
    @FXML private TextField locationField;
    @FXML private Label statusLabel;

    private final AuthService authService = AuthService.getInstance();

    @FXML
    public void handleRegister() {
        statusLabel.setText("");
        try {
            authService.register(
                nameField.getText(),
                emailField.getText(),
                passwordField.getText(),
                mobileField.getText(),
                locationField.getText()
            );
            AlertUtil.showSuccess("Success!", "Account created. You can now login.");
            App.navigateTo("login", nameField);
        } catch (IllegalArgumentException e) {
            statusLabel.setStyle("-fx-text-fill: #E74C3C;");
            statusLabel.setText(e.getMessage());
        }
    }

    @FXML
    public void goToLogin() {
        App.navigateTo("login", nameField);
    }
}
