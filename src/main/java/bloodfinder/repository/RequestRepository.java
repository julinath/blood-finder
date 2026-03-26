package bloodfinder.repository;

import bloodfinder.database.DatabaseManager;
import bloodfinder.model.BloodRequest;
import bloodfinder.model.enums.RequestStatus;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class RequestRepository implements Repository<BloodRequest> {

    private final Connection conn;

    private static final String JOIN_SQL =
            "SELECT br.*, " +
            "       ru.name AS requester_name, " +
            "       du.name AS donor_name, " +
            "       d.blood_type AS donor_blood_type " +
            "FROM blood_requests br " +
            "JOIN users ru  ON br.requester_id = ru.id " +
            "JOIN donors d  ON br.donor_id = d.id " +
            "JOIN users du  ON d.user_id = du.id ";

    public RequestRepository() {
        this.conn = DatabaseManager.getInstance().getConnection();
    }

    @Override
    public boolean save(BloodRequest req) {
        String sql = "INSERT INTO blood_requests (requester_id, donor_id, hospital, needed_date, reason) " +
                     "VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setInt(1, req.getRequesterId());
            ps.setInt(2, req.getDonorId());
            ps.setString(3, req.getHospital());
            ps.setString(4, req.getNeededDate());
            ps.setString(5, req.getReason());
            int rows = ps.executeUpdate();
            if (rows > 0) {
                ResultSet keys = ps.getGeneratedKeys();
                if (keys.next()) req.setId(keys.getInt(1));
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public BloodRequest findById(int id) {
        try (PreparedStatement ps = conn.prepareStatement(JOIN_SQL + "WHERE br.id = ?")) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return mapRequest(rs);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public List<BloodRequest> findAll() {
        return query(JOIN_SQL + "ORDER BY br.created_at DESC");
    }

    /** All requests sent by the user */
    public List<BloodRequest> findByRequesterId(int requesterId) {
        return query(JOIN_SQL + "WHERE br.requester_id = " + requesterId + " ORDER BY br.created_at DESC");
    }

    /** All requests received by the donor */
    public List<BloodRequest> findByDonorId(int donorId) {
        return query(JOIN_SQL + "WHERE br.donor_id = " + donorId + " ORDER BY br.created_at DESC");
    }

    /** Pending requests received by the donor (for notifications) */
    public List<BloodRequest> findPendingByDonorId(int donorId) {
        return query(JOIN_SQL + "WHERE br.donor_id = " + donorId + " AND br.status = 'PENDING' ORDER BY br.created_at DESC");
    }

    @Override
    public boolean update(BloodRequest req) {
        String sql = "UPDATE blood_requests SET status=?, cancel_reason=? WHERE id=?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, req.getStatus().name());
            ps.setString(2, req.getCancelReason());
            ps.setInt(3, req.getId());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean delete(int id) {
        String sql = "DELETE FROM blood_requests WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    private List<BloodRequest> query(String sql) {
        List<BloodRequest> list = new ArrayList<>();
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) list.add(mapRequest(rs));
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    private BloodRequest mapRequest(ResultSet rs) throws SQLException {
        BloodRequest r = new BloodRequest();
        r.setId(rs.getInt("id"));
        r.setRequesterId(rs.getInt("requester_id"));
        r.setDonorId(rs.getInt("donor_id"));
        r.setHospital(rs.getString("hospital"));
        r.setNeededDate(rs.getString("needed_date"));
        r.setReason(rs.getString("reason"));
        r.setStatus(RequestStatus.valueOf(rs.getString("status")));
        r.setCancelReason(rs.getString("cancel_reason"));
        r.setCreatedAt(rs.getString("created_at"));
        r.setRequesterName(rs.getString("requester_name"));
        r.setDonorName(rs.getString("donor_name"));
        r.setDonorBloodType(rs.getString("donor_blood_type"));
        return r;
    }
}
