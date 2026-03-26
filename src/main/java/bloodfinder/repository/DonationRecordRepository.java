package bloodfinder.repository;

import bloodfinder.database.DatabaseManager;
import bloodfinder.model.DonationRecord;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DonationRecordRepository implements Repository<DonationRecord> {

    private final Connection conn;

    public DonationRecordRepository() {
        this.conn = DatabaseManager.getInstance().getConnection();
    }

    @Override
    public boolean save(DonationRecord record) {
        String sql = "INSERT INTO donation_records (donor_id, request_id, donation_date, hospital, requester_name) " +
                     "VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setInt(1, record.getDonorId());
            ps.setInt(2, record.getRequestId());
            ps.setString(3, record.getDonationDate());
            ps.setString(4, record.getHospital());
            ps.setString(5, record.getRequesterName());
            int rows = ps.executeUpdate();
            if (rows > 0) {
                ResultSet keys = ps.getGeneratedKeys();
                if (keys.next()) record.setId(keys.getInt(1));
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public DonationRecord findById(int id) {
        String sql = "SELECT * FROM donation_records WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return mapRecord(rs);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public List<DonationRecord> findAll() {
        List<DonationRecord> list = new ArrayList<>();
        String sql = "SELECT * FROM donation_records ORDER BY donation_date DESC";
        try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) list.add(mapRecord(rs));
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public List<DonationRecord> findByDonorId(int donorId) {
        List<DonationRecord> list = new ArrayList<>();
        String sql = "SELECT * FROM donation_records WHERE donor_id = ? ORDER BY donation_date DESC";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, donorId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) list.add(mapRecord(rs));
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public boolean update(DonationRecord record) {
        return false; // Donation records are immutable
    }

    @Override
    public boolean delete(int id) {
        String sql = "DELETE FROM donation_records WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    private DonationRecord mapRecord(ResultSet rs) throws SQLException {
        DonationRecord r = new DonationRecord();
        r.setId(rs.getInt("id"));
        r.setDonorId(rs.getInt("donor_id"));
        r.setRequestId(rs.getInt("request_id"));
        r.setDonationDate(rs.getString("donation_date"));
        r.setHospital(rs.getString("hospital"));
        r.setRequesterName(rs.getString("requester_name"));
        return r;
    }
}
