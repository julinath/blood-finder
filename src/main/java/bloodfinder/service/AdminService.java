package bloodfinder.service;

import bloodfinder.database.DatabaseManager;
import bloodfinder.model.BloodRequest;
import bloodfinder.model.Donor;
import bloodfinder.model.User;
import bloodfinder.repository.DonationRecordRepository;
import bloodfinder.repository.DonorRepository;
import bloodfinder.repository.RequestRepository;
import bloodfinder.repository.UserRepository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

public class AdminService {

    private static AdminService instance;
    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final RequestRepository requestRepository;
    private final DonationRecordRepository recordRepository;
    private final Connection conn;

    private AdminService() {
        this.userRepository    = new UserRepository();
        this.donorRepository   = new DonorRepository();
        this.requestRepository = new RequestRepository();
        this.recordRepository  = new DonationRecordRepository();
        this.conn              = DatabaseManager.getInstance().getConnection();
    }

    public static synchronized AdminService getInstance() {
        if (instance == null) instance = new AdminService();
        return instance;
    }

    // --- Statistics ---

    public int getTotalUsers() {
        return (int) userRepository.findAll().stream().filter(u -> !u.isAdmin()).count();
    }

    public int getTotalDonors() {
        return donorRepository.findAll().size();
    }

    public int getTotalRequests() {
        return requestRepository.findAll().size();
    }

    public int getTotalDonations() {
        return recordRepository.findAll().size();
    }

    // --- Donor Management ---

    public List<Donor> getAllDonors() {
        return donorRepository.findAll().stream()
                .filter(Donor::isApproved)
                .collect(Collectors.toList());
    }

    public List<Donor> getPendingDonors() {
        return donorRepository.findPendingApproval();
    }

    public boolean approveDonor(int donorId) {
        return donorRepository.approveDonor(donorId);
    }

    public void deleteDonor(int donorId) {
        DonorService.getInstance().removeDonorStatus(donorId);
    }

    // --- Blood Request Management ---

    public List<BloodRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public boolean deleteRequest(int requestId) {
        return requestRepository.delete(requestId);
    }

    // --- User Management ---

    public List<User> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(u -> !u.isAdmin())
                .collect(Collectors.toList());
    }

    public boolean makeAdmin(int userId) {
        String sql = "UPDATE users SET role = 'ADMIN' WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}
