package bloodfinder.util;

public class ValidationUtil {

    public static boolean isValidEmail(String email) {
        if (email == null || email.isBlank()) return false;
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    public static boolean isValidMobile(String mobile) {
        if (mobile == null || mobile.isBlank()) return false;
        return mobile.matches("^[0-9]{10,15}$");
    }

    public static boolean isNotEmpty(String... fields) {
        for (String field : fields) {
            if (field == null || field.isBlank()) return false;
        }
        return true;
    }
}
