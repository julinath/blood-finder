package bloodfinder.controller;

import bloodfinder.App;
import bloodfinder.model.Donor;
import bloodfinder.model.enums.AvailabilityStatus;
import bloodfinder.service.AuthService;
import bloodfinder.service.DonorService;
import bloodfinder.util.DataHolder;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;

public class DonorProfileController {

    @FXML private Label lblBloodTypeBig;
    @FXML private Label lblDonorName;
    @FXML private Label lblDonorLocation;
    @FXML private Label lblAvailability;
    @FXML private Label lblDonationCount;
    @FXML private Label lblLastDonation;
    @FXML private Label lblDaysUntil;
    @FXML private Button btnRequestBlood;
    @FXML private Label lblRequestNote;

    private final AuthService authService = AuthService.getInstance();
    private final DonorService donorService = DonorService.getInstance();

    private Donor donor;

    @FXML
    public void initialize() {
        donor = DataHolder.getSelectedDonor();
        if (donor == null) {
            App.navigateTo("donor-search");
            return;
        }

        // Basic info
        lblBloodTypeBig.setText(donor.getBloodType().getDisplayName());
        lblDonorName.setText(donor.getName());
        lblDonorLocation.setText("📍 " + donor.getLocation());

        // Availability
        AvailabilityStatus avail = donor.getAvailabilityStatus();
        lblAvailability.setText(avail.getDisplayName());
        String availColor = switch (avail) {
            case AVAILABLE        -> "#27AE60";
            case UNAVAILABLE      -> "#E74C3C";
            case TEMP_UNAVAILABLE -> "#E67E22";
        };
        lblAvailability.setStyle("-fx-text-fill: " + availColor + "; " +
                                 "-fx-background-color: " + availColor + "22; " +
                                 "-fx-background-radius: 12; -fx-padding: 4 12;");

        // Stats
        int count = donorService.getDonationCount(donor.getDonorId());
        lblDonationCount.setText(String.valueOf(count));

        String last = donor.getLastDonationDate();
        lblLastDonation.setText(last == null || last.isBlank() ? "Never" : last);

        int daysLeft = donor.getDaysUntilAvailable();
        lblDaysUntil.setText(daysLeft > 0 ? String.valueOf(daysLeft) : "—");

        // Request button
        if (authService.isLoggedIn()) {
            boolean isSelf = authService.getLoggedInUser().getId() == donor.getId();
            if (isSelf) {
                btnRequestBlood.setDisable(true);
                lblRequestNote.setText("You cannot request blood from yourself.");
            } else {
                btnRequestBlood.setDisable(false);
                lblRequestNote.setText("The donor will receive a notification when you send a request.");
            }
        } else {
            btnRequestBlood.setText("Login to Request");
            btnRequestBlood.setOnAction(e -> App.navigateTo("login", btnRequestBlood));
            lblRequestNote.setText("Please login to send a blood request.");
        }
    }

    @FXML
    public void handleRequestBlood() {
        // donor is already set in DataHolder
        App.navigateTo("request-form", btnRequestBlood);
    }

    @FXML
    public void goBack() {
        App.navigateTo("donor-search", lblDonorName);
    }
}
