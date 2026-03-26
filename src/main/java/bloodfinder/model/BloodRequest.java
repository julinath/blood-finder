package bloodfinder.model;

import bloodfinder.model.enums.RequestStatus;

public class BloodRequest {
    private int id;
    private int requesterId;
    private int donorId;          // donors.id (FK)
    private String hospital;
    private String neededDate;
    private String reason;
    private RequestStatus status;
    private String cancelReason;
    private String createdAt;

    // Display fields (joined from DB, not stored in this table)
    private String requesterName;
    private String donorName;
    private String donorBloodType;

    public BloodRequest() {
        this.status = RequestStatus.PENDING;
    }

    public BloodRequest(int requesterId, int donorId, String hospital, String neededDate, String reason) {
        this.requesterId = requesterId;
        this.donorId = donorId;
        this.hospital = hospital;
        this.neededDate = neededDate;
        this.reason = reason;
        this.status = RequestStatus.PENDING;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getRequesterId() { return requesterId; }
    public void setRequesterId(int requesterId) { this.requesterId = requesterId; }

    public int getDonorId() { return donorId; }
    public void setDonorId(int donorId) { this.donorId = donorId; }

    public String getHospital() { return hospital; }
    public void setHospital(String hospital) { this.hospital = hospital; }

    public String getNeededDate() { return neededDate; }
    public void setNeededDate(String neededDate) { this.neededDate = neededDate; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public String getCancelReason() { return cancelReason; }
    public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }

    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }

    public String getDonorBloodType() { return donorBloodType; }
    public void setDonorBloodType(String donorBloodType) { this.donorBloodType = donorBloodType; }
}
