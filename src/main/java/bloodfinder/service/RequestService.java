package bloodfinder.service;

import bloodfinder.model.BloodRequest;
import bloodfinder.model.DonationRecord;
import bloodfinder.model.Donor;
import bloodfinder.model.enums.RequestStatus;
import bloodfinder.repository.DonationRecordRepository;
import bloodfinder.repository.DonorRepository;
import bloodfinder.repository.RequestRepository;
import bloodfinder.util.DateUtil;

import java.util.List;

/**
 * Singleton — Blood request business logic।
 * Accept করলে DonationRecord automatically তৈরি হয়।
 */
public class RequestService {

    private static RequestService instance;
    private final RequestRepository requestRepository;
    private final DonationRecordRepository recordRepository;
    private final DonorRepository donorRepository;

    private RequestService() {
        this.requestRepository = new RequestRepository();
        this.recordRepository = new DonationRecordRepository();
        this.donorRepository = new DonorRepository();
    }

    public static synchronized RequestService getInstance() {
        if (instance == null) {
            instance = new RequestService();
        }
        return instance;
    }

    public BloodRequest sendRequest(int requesterId, int donorId, String hospital, String neededDate, String reason) {
        BloodRequest request = new BloodRequest(requesterId, donorId, hospital, neededDate, reason);
        requestRepository.save(request);
        return request;
    }

    /**
     * Request accept করলে:
     *  1) status = ACCEPTED
     *  2) DonationRecord তৈরি হয়
     *  3) Donor এর lastDonationDate আপডেট হয়
     */
    public void acceptRequest(BloodRequest request) {
        request.setStatus(RequestStatus.ACCEPTED);
        requestRepository.update(request);

        Donor donor = donorRepository.findById(request.getDonorId());
        if (donor != null) {
            String today = DateUtil.today();
            DonationRecord record = new DonationRecord(
                    donor.getDonorId(),
                    request.getId(),
                    today,
                    request.getHospital(),
                    request.getRequesterName() != null ? request.getRequesterName() : "Unknown"
            );
            recordRepository.save(record);

            donor.setLastDonationDate(today);
            donorRepository.update(donor);
        }
    }

    public void cancelRequest(BloodRequest request, String cancelReason) {
        request.setStatus(RequestStatus.CANCELLED);
        request.setCancelReason(cancelReason);
        requestRepository.update(request);
    }

    public List<BloodRequest> getRequestsByUser(int userId) {
        return requestRepository.findByRequesterId(userId);
    }

    public List<BloodRequest> getPendingRequestsForDonor(int donorId) {
        return requestRepository.findPendingByDonorId(donorId);
    }

    public List<BloodRequest> getAllRequestsForDonor(int donorId) {
        return requestRepository.findByDonorId(donorId);
    }
}
