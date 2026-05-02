package bloodfinder.controller;

import bloodfinder.App;
import bloodfinder.model.BloodRequest;
import bloodfinder.model.Donor;
import bloodfinder.model.User;
import bloodfinder.service.AdminService;
import bloodfinder.service.AuthService;
import bloodfinder.util.AlertUtil;
import javafx.fxml.FXML;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.*;
import javafx.scene.layout.*;

import java.util.List;

public class AdminPanelController {

    @FXML private Label lblAdminName;
    @FXML private VBox vboxStats;
    @FXML private VBox vboxPendingDonors;
    @FXML private VBox vboxAllDonors;
    @FXML private VBox vboxAllRequests;
    @FXML private VBox vboxUsers;

    private final AuthService  authService  = AuthService.getInstance();
    private final AdminService adminService = AdminService.getInstance();

    @FXML
    public void initialize() {
        User admin = authService.getLoggedInUser();
        if (admin == null) {
            App.navigateTo("login");
            return;
        }
        if (!admin.isAdmin()) {
            App.navigateTo("dashboard");
            return;
        }
        lblAdminName.setText("Admin: " + admin.getName());
        loadStats();
        loadPendingDonors();
        loadAllDonors();
        loadAllRequests();
        loadUsers();
    }

    // ===== STATISTICS =====

    private void loadStats() {
        vboxStats.getChildren().clear();
        HBox row = new HBox(15);
        row.setAlignment(Pos.CENTER_LEFT);
        row.getChildren().addAll(
            statCard(String.valueOf(adminService.getTotalUsers()),    "Total Users",     "#2980B9"),
            statCard(String.valueOf(adminService.getTotalDonors()),   "Total Donors",    "#C0392B"),
            statCard(String.valueOf(adminService.getTotalRequests()), "Blood Requests",  "#8E44AD"),
            statCard(String.valueOf(adminService.getTotalDonations()),"Donations Done",  "#27AE60")
        );
        vboxStats.getChildren().add(row);
    }

    private VBox statCard(String value, String label, String color) {
        VBox card = new VBox(6);
        card.setAlignment(Pos.CENTER);
        card.getStyleClass().add("card");
        card.setPrefWidth(180);
        Label val = new Label(value);
        val.setStyle("-fx-font-size: 26px; -fx-font-weight: bold; -fx-text-fill: " + color + ";");
        Label lbl = new Label(label);
        lbl.setStyle("-fx-text-fill: #7F8C8D; -fx-font-size: 12px;");
        card.getChildren().addAll(val, lbl);
        HBox.setHgrow(card, Priority.ALWAYS);
        return card;
    }

    // ===== PENDING DONORS =====

    private void loadPendingDonors() {
        vboxPendingDonors.getChildren().clear();
        List<Donor> pending = adminService.getPendingDonors();
        if (pending.isEmpty()) {
            vboxPendingDonors.getChildren().add(emptyLabel("No donor applications pending approval."));
            return;
        }
        for (Donor d : pending) {
            HBox card = rowCard();
            VBox info = infoBox(
                boldLabel(d.getName()),
                grayLabel(d.getEmail() + "  |  " + d.getLocation()),
                grayLabel("Blood Type: " + d.getBloodType().getDisplayName())
            );
            HBox.setHgrow(info, Priority.ALWAYS);

            Button btn = greenButton("Approve");
            btn.setOnAction(e -> {
                adminService.approveDonor(d.getDonorId());
                refresh();
            });
            card.getChildren().addAll(info, btn);
            vboxPendingDonors.getChildren().add(card);
        }
    }

    // ===== ALL DONORS =====

    private void loadAllDonors() {
        vboxAllDonors.getChildren().clear();
        List<Donor> donors = adminService.getAllDonors();
        if (donors.isEmpty()) {
            vboxAllDonors.getChildren().add(emptyLabel("No approved donors yet."));
            return;
        }
        for (Donor d : donors) {
            HBox card = rowCard();
            VBox info = infoBox(
                boldLabel(d.getName() + "  (" + d.getBloodType().getDisplayName() + ")"),
                grayLabel(d.getEmail() + "  |  " + d.getLocation()),
                grayLabel("Status: " + d.getAvailabilityStatus().getDisplayName())
            );
            HBox.setHgrow(info, Priority.ALWAYS);

            Button btn = redButton("Delete");
            btn.setOnAction(e -> {
                if (AlertUtil.showConfirmation("Delete Donor",
                        "Remove donor status of \"" + d.getName() + "\"?")) {
                    adminService.deleteDonor(d.getDonorId());
                    refresh();
                }
            });
            card.getChildren().addAll(info, btn);
            vboxAllDonors.getChildren().add(card);
        }
    }

    // ===== ALL BLOOD REQUESTS =====

    private void loadAllRequests() {
        vboxAllRequests.getChildren().clear();
        List<BloodRequest> requests = adminService.getAllRequests();
        if (requests.isEmpty()) {
            vboxAllRequests.getChildren().add(emptyLabel("No blood requests in the system."));
            return;
        }
        for (BloodRequest req : requests) {
            HBox card = rowCard();
            VBox info = infoBox(
                boldLabel("Requester: " + req.getRequesterName()
                          + "  →  Donor: " + req.getDonorName()
                          + " (" + req.getDonorBloodType() + ")"),
                grayLabel("Hospital: " + req.getHospital() + "  |  Needed: " + req.getNeededDate()),
                grayLabel("Submitted: " + req.getCreatedAt())
            );
            HBox.setHgrow(info, Priority.ALWAYS);

            Label badge = statusBadge(req.getStatus().name());

            Button btn = redButton("Delete");
            btn.setOnAction(e -> {
                if (AlertUtil.showConfirmation("Delete Request",
                        "Delete this blood request?")) {
                    adminService.deleteRequest(req.getId());
                    loadAllRequests();
                    loadStats();
                }
            });
            card.getChildren().addAll(info, badge, btn);
            vboxAllRequests.getChildren().add(card);
        }
    }

    // ===== USER MANAGEMENT =====

    private void loadUsers() {
        vboxUsers.getChildren().clear();
        List<User> users = adminService.getAllUsers();
        if (users.isEmpty()) {
            vboxUsers.getChildren().add(emptyLabel("No regular users found."));
            return;
        }
        for (User u : users) {
            HBox card = rowCard();
            VBox info = infoBox(
                boldLabel(u.getName()),
                grayLabel(u.getEmail() + "  |  " + u.getLocation()),
                grayLabel("Mobile: " + u.getMobile() + "  |  Joined: " + u.getCreatedAt())
            );
            HBox.setHgrow(info, Priority.ALWAYS);

            if (u.isAdmin()) {
                Label adminBadge = new Label("ADMIN");
                adminBadge.setStyle("-fx-background-color: #8E44AD; -fx-text-fill: white; " +
                                    "-fx-background-radius: 6; -fx-padding: 5 10; -fx-font-size: 11px;");
                card.getChildren().addAll(info, adminBadge);
            } else {
                Button btn = new Button("Make Admin");
                btn.setStyle("-fx-background-color: #8E44AD; -fx-text-fill: white; " +
                             "-fx-background-radius: 6; -fx-cursor: hand; -fx-padding: 8 14;");
                btn.setOnAction(e -> {
                    if (AlertUtil.showConfirmation("Make Admin",
                            "Give admin access to \"" + u.getName() + "\"?")) {
                        adminService.makeAdmin(u.getId());
                        loadUsers();
                    }
                });
                card.getChildren().addAll(info, btn);
            }
            vboxUsers.getChildren().add(card);
        }
    }

    // ===== NAVIGATION =====

    @FXML
    public void goToDashboard() {
        App.navigateTo("dashboard", lblAdminName);
    }

    @FXML
    public void handleLogout() {
        authService.logout();
        App.navigateTo("login", lblAdminName);
    }

    private void refresh() {
        loadStats();
        loadPendingDonors();
        loadAllDonors();
    }

    // ===== HELPERS =====

    private HBox rowCard() {
        HBox card = new HBox(15);
        card.getStyleClass().add("request-card");
        card.setAlignment(Pos.CENTER_LEFT);
        card.setPadding(new Insets(12));
        return card;
    }

    private VBox infoBox(Label... labels) {
        VBox box = new VBox(4);
        box.getChildren().addAll(labels);
        return box;
    }

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
        if (!css.isEmpty()) l.getStyleClass().add(css);
        return l;
    }

    private Button greenButton(String text) {
        Button b = new Button(text);
        b.setStyle("-fx-background-color: #27AE60; -fx-text-fill: white; " +
                   "-fx-background-radius: 6; -fx-cursor: hand; -fx-padding: 8 16;");
        return b;
    }

    private Button redButton(String text) {
        Button b = new Button(text);
        b.setStyle("-fx-background-color: #E74C3C; -fx-text-fill: white; " +
                   "-fx-background-radius: 6; -fx-cursor: hand; -fx-padding: 8 16;");
        return b;
    }
}
