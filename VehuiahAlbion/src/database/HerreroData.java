package database;

import java.util.ArrayList;
import model.CraftItem;

public class HerreroData {

    public static ArrayList<CraftItem> items = new ArrayList<>();

    static {

        items.add(new CraftItem(
                "Botas de Soldados",
                "Herrero",
                "Botas",
                "Botas de Placa",
                8,
                0,
                0,
                0,
                "N/A",
                0,
                "T4_SHOES_PLATE_SET1",
                "N/A"
        ));

    }

}