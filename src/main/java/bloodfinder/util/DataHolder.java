package bloodfinder.util;

import bloodfinder.model.Donor;

/**
 * Simple holder for passing data between screens.
 * Set before navigating, then get from the new screen's controller.
 */
public class DataHolder {

    private static Donor selectedDonor;

    public static void setSelectedDonor(Donor donor) {
        selectedDonor = donor;
    }

    public static Donor getSelectedDonor() {
        return selectedDonor;
    }

    public static void clear() {
        selectedDonor = null;
    }
}
