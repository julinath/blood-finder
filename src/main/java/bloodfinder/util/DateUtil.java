package bloodfinder.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

public class DateUtil {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final int DONATION_INTERVAL_DAYS = 90; // 3 months

    /** Last donation থেকে ৩ মাস পার হলে true */
    public static boolean isAvailableForDonation(String lastDonationDateStr) {
        if (lastDonationDateStr == null || lastDonationDateStr.isBlank()) return true;
        try {
            LocalDate last = LocalDate.parse(lastDonationDateStr, FMT);
            return !LocalDate.now().isBefore(last.plusDays(DONATION_INTERVAL_DAYS));
        } catch (Exception e) {
            return false;
        }
    }

    /** Available হতে কত দিন বাকি */
    public static int getDaysUntilAvailable(String lastDonationDateStr) {
        if (lastDonationDateStr == null || lastDonationDateStr.isBlank()) return 0;
        try {
            LocalDate available = LocalDate.parse(lastDonationDateStr, FMT).plusDays(DONATION_INTERVAL_DAYS);
            long days = ChronoUnit.DAYS.between(LocalDate.now(), available);
            return (int) Math.max(0, days);
        } catch (Exception e) {
            return 0;
        }
    }

    /** আজকের date — yyyy-MM-dd format */
    public static String today() {
        return LocalDate.now().format(FMT);
    }

    /** LocalDate → String */
    public static String format(LocalDate date) {
        return date == null ? "" : date.format(FMT);
    }
}
