package bloodfinder.controller;

import bloodfinder.App;
import bloodfinder.model.BloodRequest;
import bloodfinder.model.DonationRecord;
import bloodfinder.model.Donor;
import bloodfinder.model.User;
import bloodfinder.model.enums.AvailabilityStatus;
import bloodfinder.service.AuthService;
import bloodfinder.service.DonorService;
import bloodfinder.service.RequestService;
import bloodfinder.util.AlertUtil;
import bloodfinder.util.ValidationUtil;
import javafx.fxml.FXML;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.*;
import javafx.scene.layout.*;

import java.util.List;
import java.util.Optional;

public class DashboardController {

    // Header
    @FXML private Label lblUserName;

    // Overview tab
    @FXML private HBox hboxStats;
    @FXML private Button btnBecomeDonor;

    // My Requests tab
    @FXML private VBox vboxMyRequests;

    // Notifications tab (donor only)
    @FXML private Tab tabNotifications;
    @FXML private VBox vboxNotifications;

    // Donation History tab (donor only)
    @FXML private Tab tabDonationHistory;
    @FXML private VBox vboxHistory;

    // Profile tab
    @FXML private VBox vboxProfile;

    private final AuthService authService = AuthService.getInstance();
    private final DonorService donorService = DonorService.getInstance();
    private final RequestService requestService = RequestService.getInstance();

    private User user;
    private Donor donor;

    @FXML
    public void initialize() {
        user = authService.getLoggedInUser();
        if (user == null) {
            App.navigateTo("login");
            return;
        }

        lblUserName.setText("👋 " + user.getName());
        donor = donorService.getDonorByUserId(user.getId());

        setupOverviewTab();
        loadMyRequests();

        if (donor != null) {
            loadNotifications();
            loadDonationHistory();
            loadProfile();
        } else {
            // disable tabs that require donor status
            tabNotifications.setDisable(true);
            tabDonationHistory.setDisable(true);
            loadProfile();
        }
    }

    // ===== OVERVIEW TAB =====

    private void setupOverviewTab() {
        hboxStats.getChildren().clear();

        // User info card
        VBox userCard = createStatCard(user.getName(), "Account Name", "#2C3E50");
        VBox locationCard = createStatCard(user.getLocation(), "Location", "#2980B9");
        hboxStats.getChildren().addAll(userCard, locationCard);

        if (donor != null) {
            VBox bloodCard = createStatCard(donor.getBloodType().getDisplayName(), "Blood Type", "#C0392B");
            String availText = donor.isAvailable() ? "Available" :
                               (donor.isTemporarilyUnavailable() ? "Temp. Unavailable" :
                               donor.getDaysUntilAvailable() + " days left");
            VBox availCard = createStatCard(availText, "Availability",
                    donor.isAvailable() ? "#27AE60" : "#E67E22");
            int count = donorService.getDonationCount(donor.getDonorId());
            VBox countCard = createStatCard(String.valueOf(count), "Total Donations", "#8E44AD");

            hboxStats.getChildren().addAll(bloodCard, availCard, countCard);
            btnBecomeDonor.setVisible(false);
            btnBecomeDonor.setManaged(false);
        }
    }

    private VBox createStatCard(String value, String label, String color) {
        VBox card = new VBox(6);
        card.setAlignment(Pos.CENTER);
        card.getStyleClass().add("card");
        card.setPrefWidth(160);

        Label valLabel = new Label(value);
        valLabel.setStyle("-fx-font-size: 16px; -fx-font-weight: bold; -fx-text-fill: " + color + ";");
        valLabel.setWrapText(true);
        valLabel.setAlignment(Pos.CENTER);

        Label keyLabel = new Label(label);
        keyLabel.setStyle("-fx-text-fill: #7F8C8D; -fx-font-size: 12px;");

        card.getChildren().addAll(valLabel, keyLabel);
        HBox.setHgrow(card, Priority.ALWAYS);
        return card;
    }

    // ===== MY REQUESTS TAB =====

    private void loadMyRequests() {
        vboxMyRequests.getChildren().clear();
        List<BloodRequest> requests = requestService.getRequestsByUser(user.getId());

        if (requests.isEmpty()) {
            vboxMyRequests.getChildren().add(emptyLabel("You have not sent any blood requests yet."));
            return;
        }

        for (BloodRequest req : requests) {
            vboxMyRequests.getChildren().add(buildMyRequestCard(req));
        }
    }

    private HBox buildMyRequestCard(BloodRequest req) {
        HBox card = new HBox(15);
        card.getStyleClass().add("request-card");
        card.setAlignment(Pos.CENTER_LEFT);
        card.setPadding(new Insets(15));

        VBox info = new VBox(4);
        info.getChildren().addAll(
            boldLabel("Donor: " + (req.getDonorName() != null ? req.getDonorName() : "?") +
                      " (" + (req.getDonorBloodType() != null ? req.getDonorBloodType() : "") + ")"),
            grayLabel("Hospital: " + req.getHospital()),
            grayLabel("Needed: " + req.getNeededDate()),
            req.getReason() != null && !req.getReason().isBlank()
                ? grayLabel("Reason: " + req.getReason()) : new Label()
        );
        HBox.setHgrow(info, Priority.ALWAYS);

        Label statusBadge = statusBadge(req.getStatus().name());

        card.getChildren().addAll(info, statusBadge);
        return card;
    }

    // ===== NOTIFICATIONS TAB (Donor) =====

    private void loadNotifications() {
        vboxNotifications.getChildren().clear();
        List<BloodRequest> pending = requestService.getPendingRequestsForDonor(donor.getDonorId());

        if (pending.isEmpty()) {
            vboxNotifications.getChildren().add(emptyLabel("No pending requests."));
            return;
        }

        for (BloodRequest req : pending) {
            vboxNotifications.getChildren().add(buildNotificationCard(req));
        }
    }

    private VBox buildNotificationCard(BloodRequest req) {
        VBox card = new VBox(10);
        card.getStyleClass().add("request-card");
        card.setPadding(new Insets(15));

        card.getChildren().addAll(
            boldLabel("From: " + (req.getRequesterName() != null ? req.getRequesterName() : "?")),
            grayLabel("Hospital: " + req.getHospital()),
            grayLabel("Date Needed: " + req.getNeededDate()),
            req.getReason() != null && !req.getReason().isBlank()
                ? grayLabel("Reason: " + req.getReason()) : new Label()
        );

        HBox btnRow = new HBox(10);
        Button acceptBtn = new Button("✓ Accept");
        acceptBtn.setStyle("-fx-background-color: #27AE60; -fx-text-fill: white; -fx-background-radius: 6; -fx-cursor: hand; -fx-padding: 8 18;");
        acceptBtn.setOnAction(e -> {
            if (AlertUtil.showConfirmation("Confirm", "Accept this blood request?")) {
                requestService.acceptRequest(req);
                // refresh donor so lastDonationDate is updated
                donor = donorService.getDonorByUserId(user.getId());
                initialize();
                AlertUtil.showSuccess("Success!", "Request accepted.");
            }
        });

        Button cancelBtn = new Button("✗ Cancel");
        cancelBtn.setStyle("-fx-background-color: #E74C3C; -fx-text-fill: white; -fx-background-radius: 6; -fx-cursor: hand; -fx-padding: 8 18;");
        cancelBtn.setOnAction(e -> {
            Optional<String> reason = AlertUtil.showTextInput("Cancel Reason", "Reason for cancellation (optional):");
            requestService.cancelRequest(req, reason.orElse(""));
            loadNotifications();
        });

        btnRow.getChildren().addAll(acceptBtn, cancelBtn);
        card.getChildren().add(btnRow);
        return card;
    }

    // ===== DONATION HISTORY TAB =====

    private void loadDonationHistory() {
        vboxHistory.getChildren().clear();
        List<DonationRecord> history = donorService.getDonationHistory(donor.getDonorId());

        if (history.isEmpty()) {
            vboxHistory.getChildren().add(emptyLabel("No donation history yet."));
            return;
        }

        for (DonationRecord rec : history) {
            HBox card = new HBox(15);
            card.getStyleClass().add("request-card");
            card.setAlignment(Pos.CENTER_LEFT);
            card.setPadding(new Insets(15));

            Label dateLabel = new Label(rec.getDonationDate());
            dateLabel.setStyle("-fx-font-size: 15px; -fx-font-weight: bold; -fx-text-fill: #C0392B; " +
                               "-fx-background-color: #FADBD8; -fx-background-radius: 8; -fx-padding: 8 14;");

            VBox info = new VBox(4);
            info.getChildren().addAll(
                boldLabel("Hospital: " + rec.getHospital()),
                grayLabel("Requester: " + rec.getRequesterName())
            );
            HBox.setHgrow(info, Priority.ALWAYS);

            card.getChildren().addAll(dateLabel, info);
            vboxHistory.getChildren().add(card);
        }
    }

    // ===== PROFILE TAB =====

    private void loadProfile() {
        vboxProfile.getChildren().clear();

        // User info card
        VBox infoCard = new VBox(12);
        infoCard.getStyleClass().add("card");
        infoCard.getChildren().addAll(
            sectionLabel("Account Information"),
            grayLabel("Name: " + user.getName()),
            grayLabel("Email: " + user.getEmail()),
            grayLabel("Mobile: " + user.getMobile()),
            grayLabel("Location: " + user.getLocation())
        );

        // Edit profile
        VBox editCard = new VBox(10);
        editCard.getStyleClass().add("card");
        editCard.getChildren().add(sectionLabel("Update Profile"));

        TextField mobileFld = new TextField(user.getMobile());
        mobileFld.setPromptText("Mobile number");
        TextField locationFld = new TextField(user.getLocation());
        locationFld.setPromptText("Location");
        Label editStatus = new Label();

        Button saveBtn = new Button("Save Changes");
        saveBtn.setOnAction(e -> {
            if (!ValidationUtil.isNotEmpty(mobileFld.getText(), locationFld.getText())) {
                editStatus.setStyle("-fx-text-fill: #E74C3C;");
                editStatus.setText("Mobile and location are required.");
                return;
            }
            authService.updateProfile(mobileFld.getText().trim(), locationFld.getText().trim());
            editStatus.setStyle("-fx-text-fill: #27AE60;");
            editStatus.setText("Profile updated successfully!");
            setupOverviewTab();
        });

        editCard.getChildren().addAll(new Label("Mobile"), mobileFld,
                new Label("Location"), locationFld, editStatus, saveBtn);

        vboxProfile.getChildren().addAll(infoCard, editCard);

        // Donor section
        if (donor != null) {
            buildDonorSection();
        }
    }

    private void buildDonorSection() {
        VBox donorCard = new VBox(12);
        donorCard.getStyleClass().add("card");
        donorCard.getChildren().add(sectionLabel("My Donor Profile"));

        Label bloodLabel = new Label("Blood Type: " + donor.getBloodType().getDisplayName());
        bloodLabel.setStyle("-fx-font-size: 15px; -fx-font-weight: bold; -fx-text-fill: #C0392B;");

        AvailabilityStatus avail = donor.getAvailabilityStatus();
        Label availLabel = new Label("Status: " + avail.getDisplayName());
        availLabel.setStyle("-fx-text-fill: " + availColor(avail) + ";");

        String lastDon = donor.getLastDonationDate();
        Label lastDonLabel = grayLabel("Last Donation: " + (lastDon == null || lastDon.isBlank() ? "N/A" : lastDon));

        // Toggle temp unavailable
        CheckBox tempUnavailCheck = new CheckBox("Temporarily Unavailable");
        tempUnavailCheck.setSelected(donor.isTemporarilyUnavailable());
        tempUnavailCheck.setOnAction(e -> {
            donorService.setTemporarilyUnavailable(donor, tempUnavailCheck.isSelected());
            donor = donorService.getDonorByUserId(user.getId());
            setupOverviewTab();
            loadProfile();
        });

        // Remove donor
        Button removeBtn = new Button("Remove Donor Status");
        removeBtn.setStyle("-fx-background-color: #E74C3C; -fx-text-fill: white; -fx-background-radius: 6; -fx-cursor: hand; -fx-padding: 8 18;");
        removeBtn.setOnAction(e -> {
            if (AlertUtil.showConfirmation("Confirm", "Remove your donor status?")) {
                donorService.removeDonorStatus(donor.getDonorId());
                donor = null;
                AlertUtil.showSuccess("Done", "Donor status has been removed.");
                initialize();
            }
        });

        donorCard.getChildren().addAll(bloodLabel, availLabel, lastDonLabel, tempUnavailCheck, removeBtn);
        vboxProfile.getChildren().add(donorCard);
    }

    // ===== NAVIGATION =====

    @FXML public void goToSearch() { App.navigateTo("donor-search", lblUserName); }

    @FXML public void goToBecomeDonor() { App.navigateTo("become-donor", lblUserName); }

    @FXML
    public void handleLogout() {
        authService.logout();
        App.navigateTo("login", lblUserName);
    }

    // ===== HELPERS =====

    private Label boldLabel(String text) {
        Label l = new Label(text);
        l.setStyle("-fx-font-weight: bold; -fx-text-fill: #2C3E50;");
        return l;
    }

    private Label grayLabel(String text) {
        Label l = new Label(text);
        l.setStyle("-fx-text-fill: #7F8C8D;");
        return l;
    }

    private Label sectionLabel(String text) {
        Label l = new Label(text);
        l.getStyleClass().add("label-section");
        return l;
    }

    private Label emptyLabel(String text) {
        Label l = new Label(text);
        l.getStyleClass().add("empty-state");
        l.setPadding(new Insets(20));
        return l;
    }

    private Label statusBadge(String status) {
        Label l = new Label(status);
        String css = switch (status) {
            case "PENDING"   -> "badge-pending";
            case "ACCEPTED"  -> "badge-accepted";
            case "CANCELLED" -> "badge-cancelled";
            default          -> "";
        };
        l.getStyleClass().add(css);
        return l;
    }

    private String availColor(AvailabilityStatus status) {
        return switch (status) {
            case AVAILABLE       -> "#27AE60";
            case UNAVAILABLE     -> "#E74C3C";
            case TEMP_UNAVAILABLE -> "#E67E22";
        };
    }
}
