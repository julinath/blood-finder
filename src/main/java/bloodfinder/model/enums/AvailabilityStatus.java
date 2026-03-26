package bloodfinder.model.enums;

public enum AvailabilityStatus {
    AVAILABLE("Available"),
    UNAVAILABLE("Unavailable"),
    TEMP_UNAVAILABLE("Temporarily Unavailable");

    private final String displayName;

    AvailabilityStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
