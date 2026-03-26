package bloodfinder.model;

public class DonationRecord {
    private int id;
    private int donorId;       // donors.id (FK)
    private int requestId;
    private String donationDate;
    private String hospital;
    private String requesterName;

    public DonationRecord() {}

    public DonationRecord(int donorId, int requestId, String donationDate, String hospital, String requesterName) {
        this.donorId = donorId;
        this.requestId = requestId;
        this.donationDate = donationDate;
        this.hospital = hospital;
        this.requesterName = requesterName;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getDonorId() { return donorId; }
    public void setDonorId(int donorId) { this.donorId = donorId; }

    public int getRequestId() { return requestId; }
    public void setRequestId(int requestId) { this.requestId = requestId; }

    public String getDonationDate() { return donationDate; }
    public void setDonationDate(String donationDate) { this.donationDate = donationDate; }

    public String getHospital() { return hospital; }
    public void setHospital(String hospital) { this.hospital = hospital; }

    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }
}
