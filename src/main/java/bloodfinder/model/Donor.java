package bloodfinder.model;

import bloodfinder.model.enums.AvailabilityStatus;
import bloodfinder.model.enums.BloodType;
import bloodfinder.util.DateUtil;

/**
 * Donor extends User — Inheritance
 * A User who has registered as a blood donor.
 * donorId = donors.id (FK used in blood_requests)
 * getId()  = users.id  (the actual user account ID)
 */
public class Donor extends User {

    private int donorId;          // donors.id  (PRIMARY KEY of donors table)
    private BloodType bloodType;
    private String lastDonationDate;
    private boolean temporarilyUnavailable;

    public Donor() {
        super();
    }

    public Donor(User user, BloodType bloodType, String lastDonationDate) {
        super(user.getName(), user.getEmail(), user.getPassword(), user.getMobile(), user.getLocation());
        setId(user.getId());
        setCreatedAt(user.getCreatedAt());
        this.bloodType = bloodType;
        this.lastDonationDate = lastDonationDate;
        this.temporarilyUnavailable = false;
    }

    // --- Availability Logic (Polymorphism: overrides behaviour of User) ---

    public AvailabilityStatus getAvailabilityStatus() {
        if (temporarilyUnavailable) return AvailabilityStatus.TEMP_UNAVAILABLE;
        if (lastDonationDate == null || lastDonationDate.isEmpty()) return AvailabilityStatus.AVAILABLE;
        return DateUtil.isAvailableForDonation(lastDonationDate)
                ? AvailabilityStatus.AVAILABLE
                : AvailabilityStatus.UNAVAILABLE;
    }

    public boolean isAvailable() {
        return getAvailabilityStatus() == AvailabilityStatus.AVAILABLE;
    }

    public int getDaysUntilAvailable() {
        if (lastDonationDate == null || lastDonationDate.isEmpty()) return 0;
        return DateUtil.getDaysUntilAvailable(lastDonationDate);
    }

    // --- Getters & Setters (Encapsulation) ---

    public int getDonorId() { return donorId; }
    public void setDonorId(int donorId) { this.donorId = donorId; }

    public BloodType getBloodType() { return bloodType; }
    public void setBloodType(BloodType bloodType) { this.bloodType = bloodType; }

    public String getLastDonationDate() { return lastDonationDate; }
    public void setLastDonationDate(String lastDonationDate) { this.lastDonationDate = lastDonationDate; }

    public boolean isTemporarilyUnavailable() { return temporarilyUnavailable; }
    public void setTemporarilyUnavailable(boolean temporarilyUnavailable) {
        this.temporarilyUnavailable = temporarilyUnavailable;
    }

    @Override
    public String toString() {
        return "Donor{donorId=" + donorId + ", userId=" + getId() +
               ", name='" + getName() + "', bloodType=" + bloodType +
               ", availability=" + getAvailabilityStatus() + "}";
    }
}
