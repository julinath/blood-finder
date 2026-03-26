package bloodfinder.controller;

import bloodfinder.App;
import bloodfinder.model.Donor;
import bloodfinder.service.AuthService;
import bloodfinder.service.RequestService;
import bloodfinder.util.AlertUtil;
import bloodfinder.util.DataHolder;
import bloodfinder.util.DateUtil;
import javafx.fxml.FXML;
import javafx.scene.control.*;

public class RequestController {

    @FXML private Label lblDonorInfo;
    @FXML private TextField hospitalField;
    @FXML private DatePicker neededDatePicker;
    @FXML private TextArea reasonArea;
    @FXML private Label statusLabel;

    private final AuthService authService = AuthService.getInstance();
    private final RequestService requestService = RequestService.getInstance();

    private Donor donor;

    @FXML
    public void initialize() {
        donor = DataHolder.getSelectedDonor();
        if (donor == null || !authService.isLoggedIn()) {
            App.navigateTo("login");
            return;
        }
        lblDonorInfo.setText(donor.getName() + " (" + donor.getBloodType().getDisplayName() + ") — " + donor.getLocation());
    }

    @FXML
    public void handleSendRequest() {
        statusLabel.setText("");

        String hospital = hospitalField.getText();
        if (hospital == null || hospital.isBlank()) {
            showError("Please enter the hospital name.");
            return;
        }
        if (neededDatePicker.getValue() == null) {
            showError("Please select the needed date.");
            return;
        }

        String neededDate = DateUtil.format(neededDatePicker.getValue());
        String reason = reasonArea.getText();

        requestService.sendRequest(
            authService.getLoggedInUser().getId(),
            donor.getDonorId(),  // donors.id (FK) — NOT user.id
            hospital.trim(),
            neededDate,
            reason
        );

        AlertUtil.showSuccess("Success!", "Blood request sent. The donor will receive a notification.");
        DataHolder.clear();
        App.navigateTo("donor-search", hospitalField);
    }

    @FXML
    public void goBack() {
        App.navigateTo("donor-profile", hospitalField);
    }

    private void showError(String msg) {
        statusLabel.setStyle("-fx-text-fill: #E74C3C;");
        statusLabel.setText(msg);
    }
}
