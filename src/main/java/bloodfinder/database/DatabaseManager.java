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

            // Migration: add role column to users (existing users default to 'USER')
            try {
                stmt.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'USER'");
            } catch (SQLException ignored) {}

            // Migration: add is_approved to donors (DEFAULT 1 keeps existing donors visible)
            try {
                stmt.execute("ALTER TABLE donors ADD COLUMN is_approved INTEGER DEFAULT 1");
            } catch (SQLException ignored) {}

            // Migration: track whether approval notification has been shown to the donor
            try {
                stmt.execute("ALTER TABLE donors ADD COLUMN approval_notified INTEGER DEFAULT 0");
            } catch (SQLException ignored) {}
            // Existing approved donors don't need a notification — mark them as already notified
            stmt.execute("UPDATE donors SET approval_notified = 1 WHERE is_approved = 1 AND approval_notified = 0");

            // Seed primary admin — INSERT OR IGNORE is idempotent via UNIQUE email constraint
            stmt.execute("""
                INSERT OR IGNORE INTO users (name, email, password, mobile, location, role)
                VALUES ('Juli Nath', 'julinath@gmail.com', '0112358', '0000000000', 'System', 'ADMIN')
            """);
            // If julinath@gmail.com already existed as a regular user, upgrade to ADMIN
            stmt.execute("UPDATE users SET role = 'ADMIN' WHERE email = 'julinath@gmail.com'");
        }
    }
}
