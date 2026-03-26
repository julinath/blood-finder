package bloodfinder.controller;

import bloodfinder.App;
import bloodfinder.model.Donor;
import bloodfinder.model.enums.AvailabilityStatus;
import bloodfinder.model.enums.BloodType;
import bloodfinder.service.AuthService;
import bloodfinder.service.SearchService;
import bloodfinder.util.DataHolder;
import javafx.fxml.FXML;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.*;
import javafx.scene.layout.*;

import java.util.List;

public class DonorSearchController {

    @FXML private ComboBox<String> cmbBloodType;
    @FXML private TextField txtLocation;
    @FXML private CheckBox chkAvailableOnly;
    @FXML private VBox vboxDonors;
    @FXML private Label lblResultCount;
    @FXML private Label lblNavUser;
    @FXML private Button btnNavAction;

    private final SearchService searchService = SearchService.getInstance();
    private final AuthService authService = AuthService.getInstance();

    @FXML
    public void initialize() {
        cmbBloodType.getItems().add("Any");
        for (BloodType bt : BloodType.values()) {
            cmbBloodType.getItems().add(bt.getDisplayName());
        }
        cmbBloodType.setValue("Any");

        if (authService.isLoggedIn()) {
            lblNavUser.setText(authService.getLoggedInUser().getName());
            btnNavAction.setText("Dashboard");
        } else {
            lblNavUser.setText("Guest");
            btnNavAction.setText("Login");
        }

        showDonors(searchService.getAllDonors());
    }

    @FXML
    public void handleSearch() {
        String selected = cmbBloodType.getValue();
        BloodType type = null;
        if (selected != null && !selected.equals("Any")) {
            try { type = BloodType.fromString(selected); } catch (Exception ignored) {}
        }
        String loc = txtLocation.getText();
        boolean availOnly = chkAvailableOnly.isSelected();

        showDonors(searchService.searchDonors(type, loc, availOnly));
    }

    @FXML
    public void handleClear() {
        cmbBloodType.setValue("Any");
        txtLocation.clear();
        chkAvailableOnly.setSelected(false);
        showDonors(searchService.getAllDonors());
    }

    @FXML
    public void handleNavAction() {
        if (authService.isLoggedIn()) {
            App.navigateTo("dashboard", cmbBloodType);
        } else {
            App.navigateTo("login", cmbBloodType);
        }
    }

    private void showDonors(List<Donor> donors) {
        vboxDonors.getChildren().clear();
        lblResultCount.setText(donors.size() + " donor(s) found");

        if (donors.isEmpty()) {
            Label empty = new Label("No donors found.");
            empty.getStyleClass().add("empty-state");
            empty.setPadding(new Insets(30));
            vboxDonors.getChildren().add(empty);
            return;
        }

        for (Donor donor : donors) {
            vboxDonors.getChildren().add(buildDonorCard(donor));
        }
    }

    private HBox buildDonorCard(Donor donor) {
        HBox card = new HBox(15);
        card.getStyleClass().add("donor-card");
        card.setAlignment(Pos.CENTER_LEFT);
        card.setPadding(new Insets(15, 20, 15, 20));

        // Blood type badge
        Label bloodBadge = new Label(donor.getBloodType().getDisplayName());
        bloodBadge.getStyleClass().add("badge-blood");
        bloodBadge.setMinWidth(50);
        bloodBadge.setAlignment(Pos.CENTER);

        // Info
        VBox info = new VBox(4);
        Label name = new Label(donor.getName());
        name.getStyleClass().add("donor-name");
        Label location = new Label("📍 " + donor.getLocation());
        location.getStyleClass().add("donor-location");
        info.getChildren().addAll(name, location);
        HBox.setHgrow(info, Priority.ALWAYS);

        // Availability badge
        AvailabilityStatus avail = donor.getAvailabilityStatus();
        Label availBadge = new Label(avail.getDisplayName());
        String badgeCss = switch (avail) {
            case AVAILABLE       -> "badge-available";
            case UNAVAILABLE     -> "badge-unavailable";
            case TEMP_UNAVAILABLE -> "badge-temp-unavailable";
        };
        availBadge.getStyleClass().add(badgeCss);

        // View Profile button
        Button viewBtn = new Button("View Profile");
        viewBtn.setStyle("-fx-background-color: #C0392B; -fx-text-fill: white; " +
                         "-fx-background-radius: 6; -fx-cursor: hand; -fx-padding: 8 14;");
        viewBtn.setOnAction(e -> viewDonorProfile(donor));

        card.getChildren().addAll(bloodBadge, info, availBadge, viewBtn);
        return card;
    }

    private void viewDonorProfile(Donor donor) {
        DataHolder.setSelectedDonor(donor);
        App.navigateTo("donor-profile", cmbBloodType);
    }
}
