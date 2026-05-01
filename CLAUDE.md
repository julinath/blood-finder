# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run the application
mvn javafx:run

# Compile only
mvn compile

# Clean and package
mvn clean package
```

The SQLite database (`blood_finder.db`) is auto-created in the project root on first run — no setup required.

There are no tests in this project (`src/test/` does not exist).

## Architecture

This is a JavaFX desktop application (Java 17, JavaFX 21, SQLite via JDBC). It follows a strict layered architecture:

```
Controller → Service → Repository → DatabaseManager (SQLite)
```

### Navigation

`App.navigateTo(String fxmlName)` is the single navigation mechanism. It loads `/fxml/{fxmlName}.fxml` and replaces the primary stage scene. Screen names are the FXML filenames without extension (`"login"`, `"dashboard"`, `"donor-search"`, `"donor-profile"`, `"become-donor"`, `"request-form"`).

When a controller needs to navigate, it calls `App.navigateTo(name, someNode)` — passing any `Node` from the current scene so the method can extract the Stage reference.

Between-screen data passing uses `DataHolder` (a static holder class) — the selected `Donor` is set before navigating to `donor-profile` or `request-form`.

### Services (Singletons)

All services follow the singleton pattern with `getInstance()`. They own all business logic:

- **AuthService** — login/logout, session state (`getLoggedInUser()`, `isLoggedIn()`), profile updates. Password is stored plain-text (intentional — educational project).
- **DonorService** — converting a User into a Donor, toggling availability, donation history.
- **SearchService** — filters donors using Stream API by blood type, location, and availability.
- **RequestService** — manages the full request lifecycle: `sendRequest()` → `acceptRequest()` (auto-creates `DonationRecord` and updates `lastDonationDate`) or `cancelRequest()`.

Controllers instantiate services at the top of each class: `private AuthService authService = AuthService.getInstance();`

### Repositories

`Repository<T>` is a generic interface (save, findById, findAll, update, delete). Each repository handles raw JDBC with `PreparedStatement` and maps `ResultSet` to model objects manually. `RequestRepository` joins 3 tables to populate display-only fields (`requesterName`, `donorName`, `donorBloodType`) directly on the `BloodRequest` model.

### Database

`DatabaseManager` is a singleton holding a single shared `Connection` to `blood_finder.db`. It runs `PRAGMA foreign_keys = ON` and creates all 4 tables (`users`, `donors`, `blood_requests`, `donation_records`) on initialization. It is initialized once in `App.start()`.

`donation_records` is immutable — no update or delete operations exist for it.

### Session & Access Control

Session state lives in `AuthService.loggedInUser`. Controllers check `authService.isLoggedIn()` in their `initialize()` method and redirect to login if needed. `DonorSearchController` is the only screen accessible without login.

### Key Utilities

- `AlertUtil` — all dialogs (error, success, confirm, text input)
- `DateUtil` — date formatting and 90-day donation eligibility check
- `ValidationUtil` — email regex, mobile format, required-field checks

### Enums as DB Values

`BloodType`, `RequestStatus`, and `AvailabilityStatus` are stored as their `.name()` string in SQLite and retrieved with `Enum.valueOf()`.
