package bloodfinder.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Singleton Pattern — একটাই database connection থাকবে।
 */
public class DatabaseManager {

    private static final String DB_URL = "jdbc:sqlite:blood_finder.db";
    private static DatabaseManager instance;
    private Connection connection;

    private DatabaseManager() {
        try {
            connection = DriverManager.getConnection(DB_URL);
            connection.createStatement().execute("PRAGMA foreign_keys = ON");
            createTables();
        } catch (SQLException e) {
            throw new RuntimeException("Database connection failed", e);
        }
    }

    public static synchronized DatabaseManager getInstance() {
        if (instance == null) {
            instance = new DatabaseManager();
        }
        return instance;
    }

    public Connection getConnection() {
        return connection;
    }

    private void createTables() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id         INTEGER PRIMARY KEY AUTOINCREMENT,
                    name       TEXT NOT NULL,
                    email      TEXT UNIQUE NOT NULL,
                    password   TEXT NOT NULL,
                    mobile     TEXT NOT NULL,
                    location   TEXT NOT NULL,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            """);

            stmt.execute("""
                CREATE TABLE IF NOT EXISTS donors (
                    id                       INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id                  INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                    blood_type               TEXT NOT NULL,
                    last_donation_date       TEXT,
                    is_temporarily_unavailable INTEGER DEFAULT 0,
                    created_at               TEXT DEFAULT CURRENT_TIMESTAMP
                )
            """);

            stmt.execute("""
                CREATE TABLE IF NOT EXISTS blood_requests (
                    id           INTEGER PRIMARY KEY AUTOINCREMENT,
                    requester_id INTEGER NOT NULL REFERENCES users(id),
                    donor_id     INTEGER NOT NULL REFERENCES donors(id),
                    hospital     TEXT NOT NULL,
                    needed_date  TEXT NOT NULL,
                    reason       TEXT,
                    status       TEXT DEFAULT 'PENDING',
                    cancel_reason TEXT,
                    created_at   TEXT DEFAULT CURRENT_TIMESTAMP
                )
            """);

            stmt.execute("""
                CREATE TABLE IF NOT EXISTS donation_records (
                    id             INTEGER PRIMARY KEY AUTOINCREMENT,
                    donor_id       INTEGER NOT NULL REFERENCES donors(id),
                    request_id     INTEGER NOT NULL REFERENCES blood_requests(id),
                    donation_date  TEXT NOT NULL,
                    hospital       TEXT NOT NULL,
                    requester_name TEXT NOT NULL
                )
            """);
        }
    }
}
