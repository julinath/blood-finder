package bloodfinder.controller;

import bloodfinder.App;
import bloodfinder.model.enums.BloodType;
import bloodfinder.service.AuthService;
import bloodfinder.service.DonorService;
import bloodfinder.util.AlertUtil;
import bloodfinder.util.DateUtil;
import javafx.fxml.FXML;
import javafx.scene.control.ComboBox;
import javafx.scene.control.DatePicker;
import javafx.scene.control.Label;

public class BecomeDonorController {

    @FXML private ComboBox<String> cmbBloodType;
    @FXML private DatePicker lastDonationPicker;
    @FXML private Label statusLabel;

    private final AuthService authService = AuthService.getInstance();
    private final DonorService donorService = DonorService.getInstance();

    @FXML
    public void initialize() {
        if (!authService.isLoggedIn()) {
            App.navigateTo("login");
            return;
        }
        for (BloodType bt : BloodType.values()) {
            cmbBloodType.getItems().add(bt.getDisplayName());
        }
    }

    @FXML
    public void handleBecomeDonor() {
        statusLabel.setText("");

        if (cmbBloodType.getValue() == null) {
            showError("Please select your blood type.");
            return;
        }

        BloodType bloodType = BloodType.fromString(cmbBloodType.getValue());
        String lastDate = lastDonationPicker.getValue() != null
                ? DateUtil.format(lastDonationPicker.getValue())
                : "";

        try {
            donorService.becomeDonor(authService.getLoggedInUser(), bloodType, lastDate);
            AlertUtil.showSuccess("Success!", "You are now registered as a Blood Donor!");
            App.navigateTo("dashboard", cmbBloodType);
        } catch (IllegalStateException e) {
            showError(e.getMessage());
        }
    }

    @FXML
    public void goBack() {
        App.navigateTo("dashboard", cmbBloodType);
    }

    private void showError(String msg) {
        statusLabel.setStyle("-fx-text-fill: #E74C3C;");
        statusLabel.setText(msg);
    }
}
