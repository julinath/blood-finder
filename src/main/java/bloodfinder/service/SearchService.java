package bloodfinder.service;

import bloodfinder.model.Donor;
import bloodfinder.model.enums.BloodType;
import bloodfinder.repository.DonorRepository;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Singleton — Donor search & filter logic।
 * Collections + Stream API ব্যবহার করে।
 */
public class SearchService {

    private static SearchService instance;
    private final DonorRepository donorRepository;

    private SearchService() {
        this.donorRepository = new DonorRepository();
    }

    public static synchronized SearchService getInstance() {
        if (instance == null) {
            instance = new SearchService();
        }
        return instance;
    }

    /**
     * Filter: bloodType (null = any), location (blank = any), availableOnly
     */
    public List<Donor> searchDonors(BloodType bloodType, String location, boolean availableOnly) {
        List<Donor> all = donorRepository.findAll();

        return all.stream()
                .filter(Donor::isApproved)
                .filter(d -> bloodType == null || d.getBloodType() == bloodType)
                .filter(d -> location == null || location.isBlank() ||
                        d.getLocation().toLowerCase().contains(location.trim().toLowerCase()))
                .filter(d -> !availableOnly || d.isAvailable())
                .collect(Collectors.toList());
    }

    public List<Donor> getAllDonors() {
        return donorRepository.findAll().stream()
                .filter(Donor::isApproved)
                .collect(Collectors.toList());
    }
}
