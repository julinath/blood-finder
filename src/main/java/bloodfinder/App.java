package bloodfinder;

import bloodfinder.database.DatabaseManager;
import bloodfinder.util.AlertUtil;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.Node;
import javafx.stage.Stage;

import java.io.IOException;

public class App extends Application {

    private static Stage primaryStage;

    @Override
    public void start(Stage stage) {
        primaryStage = stage;
        DatabaseManager.getInstance(); // initialize database on startup
        stage.setTitle("Blood Finder");
        stage.setMinWidth(800);
        stage.setMinHeight(550);
        navigateTo("login");
        stage.show();
    }

    /** Navigate by screen name (e.g. "login", "dashboard") */
    public static void navigateTo(String fxmlName) {
        loadScene(fxmlName, primaryStage);
    }

    /** Navigate using any Node from a controller to get its Stage */
    public static void navigateTo(String fxmlName, Node fromNode) {
        Stage stage = (Stage) fromNode.getScene().getWindow();
        loadScene(fxmlName, stage);
    }

    private static void loadScene(String fxmlName, Stage stage) {
        try {
            FXMLLoader loader = new FXMLLoader(App.class.getResource("/fxml/" + fxmlName + ".fxml"));
            Parent root = loader.load();
            Scene scene = new Scene(root);
            scene.getStylesheets().add(App.class.getResource("/styles/style.css").toExternalForm());
            stage.setScene(scene);
        } catch (IOException e) {
            AlertUtil.showError("Navigation Error", "Could not load screen: " + fxmlName);
            e.printStackTrace();
        }
    }

    public static Stage getPrimaryStage() {
        return primaryStage;
    }

    public static void main(String[] args) {
        launch(args);
    }
}
