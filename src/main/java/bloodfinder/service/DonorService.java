package bloodfinder.service;

import bloodfinder.model.Donor;
import bloodfinder.model.DonationRecord;
import bloodfinder.model.User;
import bloodfinder.model.enums.BloodType;
import bloodfinder.repository.DonationRecordRepository;
import bloodfinder.repository.DonorRepository;

import java.util.List;

/**
 * Singleton — Donor management business logic।
 * Composition: DonorService has-a DonorRepository।
 */
public class DonorService {

    private static DonorService instance;
    private final DonorRepository donorRepository;
    private final DonationRecordRepository recordRepository;

    private DonorService() {
        this.donorRepository = new DonorRepository();
        this.recordRepository = new DonationRecordRepository();
    }

    public static synchronized DonorService getInstance() {
        if (instance == null) {
            instance = new DonorService();
        }
        return instance;
    }

    public Donor becomeDonor(User user, BloodType bloodType, String lastDonationDate) {
        if (donorRepository.isDonor(user.getId()))
            throw new IllegalStateException("আপনি ইতিমধ্যে donor।");

        Donor donor = new Donor(user, bloodType, lastDonationDate);
        donorRepository.save(donor);
        return donor;
    }

    public void removeDonorStatus(int donorId) {
        donorRepository.delete(donorId);
    }

    public Donor getDonorByUserId(int userId) {
        return donorRepository.findByUserId(userId);
    }

    public Donor getDonorById(int donorId) {
        return donorRepository.findById(donorId);
    }

    public boolean isDonor(int userId) {
        return donorRepository.isDonor(userId);
    }

    public void setTemporarilyUnavailable(Donor donor, boolean unavailable) {
        donor.setTemporarilyUnavailable(unavailable);
        donorRepository.update(donor);
    }

    public int getDonationCount(int donorId) {
        return donorRepository.getDonationCount(donorId);
    }

    public List<DonationRecord> getDonationHistory(int donorId) {
        return recordRepository.findByDonorId(donorId);
    }
}
