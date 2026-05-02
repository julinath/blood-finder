package bloodfinder.repository;

import bloodfinder.database.DatabaseManager;
import bloodfinder.model.Donor;
import bloodfinder.model.User;
import bloodfinder.model.enums.BloodType;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * DonorRepository implements Repository<Donor> — Interface + Generics
 * Builds Donor objects from a JOIN of donors table and users table.
 */
public class DonorRepository implements Repository<Donor> {

    private final Connection conn;

    private static final String JOIN_SQL =
            "SELECT u.id, u.name, u.email, u.password, u.mobile, u.location, u.created_at, " +
            "       d.id AS donor_id, d.blood_type, d.last_donation_date, " +
            "       d.is_temporarily_unavailable, d.is_approved, d.approval_notified " +
            "FROM donors d JOIN users u ON d.user_id = u.id ";

    public DonorRepository() {
        this.conn = DatabaseManager.getInstance().getConnection();
    }

    @Override
    public boolean save(Donor donor) {
        String sql = "INSERT INTO donors (user_id, blood_type, last_donation_date, is_temporarily_unavailable) " +
                     "VALUES (?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setInt(1, donor.getId());   // users.id
            ps.setString(2, donor.getBloodType().name());
            ps.setString(3, donor.getLastDonationDate());
            ps.setInt(4, donor.isTemporarilyUnavailable() ? 1 : 0);
            int rows = ps.executeUpdate();
            if (rows > 0) {
                ResultSet keys = ps.getGeneratedKeys();
                if (keys.next()) donor.setDonorId(keys.getInt(1));
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public Donor findById(int donorId) {
        try (PreparedStatement ps = conn.prepareStatement(JOIN_SQL + "WHERE d.id = ?")) {
            ps.setInt(1, donorId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return mapDonor(rs);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /** Find donor by userId (users.id) */
    public Donor findByUserId(int userId) {
        try (PreparedStatement ps = conn.prepareStatement(JOIN_SQL + "WHERE d.user_id = ?")) {
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return mapDonor(rs);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public List<Donor> findAll() {
        List<Donor> list = new ArrayList<>();
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(JOIN_SQL)) {
            while (rs.next()) list.add(mapDonor(rs));
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public boolean update(Donor donor) {
        String sql = "UPDATE donors SET blood_type=?, last_donation_date=?, is_temporarily_unavailable=? WHERE id=?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, donor.getBloodType().name());
            ps.setString(2, donor.getLastDonationDate());
            ps.setInt(3, donor.isTemporarilyUnavailable() ? 1 : 0);
            ps.setInt(4, donor.getDonorId());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean delete(int donorId) {
        String sql = "DELETE FROM donors WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, donorId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean isDonor(int userId) {
        String sql = "SELECT COUNT(*) FROM donors WHERE user_id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            return rs.getInt(1) > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public int getDonationCount(int donorId) {
        String sql = "SELECT COUNT(*) FROM donation_records WHERE donor_id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, donorId);
            ResultSet rs = ps.executeQuery();
            return rs.getInt(1);
        } catch (SQLException e) {
            return 0;
        }
    }

    private Donor mapDonor(ResultSet rs) throws SQLException {
        User user = new User();
        user.setId(rs.getInt("id"));
        user.setName(rs.getString("name"));
        user.setEmail(rs.getString("email"));
        user.setPassword(rs.getString("password"));
        user.setMobile(rs.getString("mobile"));
        user.setLocation(rs.getString("location"));
        user.setCreatedAt(rs.getString("created_at"));

        Donor donor = new Donor(user,
                BloodType.valueOf(rs.getString("blood_type")),
                rs.getString("last_donation_date"));
        donor.setDonorId(rs.getInt("donor_id"));
        donor.setTemporarilyUnavailable(rs.getInt("is_temporarily_unavailable") == 1);
        try { donor.setApproved(rs.getInt("is_approved") == 1); } catch (SQLException ignored) { donor.setApproved(true); }
        try { donor.setApprovalNotified(rs.getInt("approval_notified") == 1); } catch (SQLException ignored) { donor.setApprovalNotified(true); }
        return donor;
    }

    public boolean approveDonor(int donorId) {
        String sql = "UPDATE donors SET is_approved = 1 WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, donorId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean markApprovalNotified(int donorId) {
        String sql = "UPDATE donors SET approval_notified = 1 WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, donorId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public List<Donor> findPendingApproval() {
        List<Donor> list = new ArrayList<>();
        try (PreparedStatement ps = conn.prepareStatement(JOIN_SQL + "WHERE d.is_approved = 0")) {
            ResultSet rs = ps.executeQuery();
            while (rs.next()) list.add(mapDonor(rs));
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
}
