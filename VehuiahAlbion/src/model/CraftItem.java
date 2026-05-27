package model;

public class CraftItem {

    private String itemName;
    private String artisan;
    private String itemType;
    private String category;

    private int bars;
    private int wood;
    private int cloth;
    private int leather;

    private String artifact1;
    private int artifact1Amount;

    private String itemImage;
    private String artifactImage;

    public CraftItem(
            String itemName,
            String artisan,
            String itemType,
            String category,
            int bars,
            int wood,
            int cloth,
            int leather,
            String artifact1,
            int artifact1Amount,
            String itemImage,
            String artifactImage
    ) {
        this.itemName = itemName;
        this.artisan = artisan;
        this.itemType = itemType;
        this.category = category;
        this.bars = bars;
        this.wood = wood;
        this.cloth = cloth;
        this.leather = leather;
        this.artifact1 = artifact1;
        this.artifact1Amount = artifact1Amount;
        this.itemImage = itemImage;
        this.artifactImage = artifactImage;
    }

    // Getters básicos
    public String getItemName() { return itemName; }
    public String getArtisan() { return artisan; }
    public String getItemType() { return itemType; }
    public String getCategory() { return category; }
    public int getBars() { return bars; }
    public int getWood() { return wood; }
    public int getCloth() { return cloth; }
    public int getLeather() { return leather; }
    public String getItemImage() { return itemImage; }
    public String getArtifactImage() { return artifactImage; }

    // ==========================================
    // MÉTODOS DE ARTEFACTOS (Corrigiendo errores)
    // ==========================================

    public String getArtifact1() {
        return artifact1;
    }

    public int getArtifact1Amount() {
        return artifact1Amount;
    }

    // Corrigiendo: cannot find symbol: method getArtifactName()
    public String getArtifactName() {
        return artifact1;
    }

    // Corrigiendo: cannot find symbol: method getArtifactAmount()
    public int getArtifactAmount() {
        return artifact1Amount;
    }

    // ==========================================
    // MATERIAL 1
    // ==========================================

    public String getMaterial1Name() {
        if (bars > 0) return "Lingote";
        if (wood > 0) return "Tabla";
        if (cloth > 0) return "Tela";
        if (leather > 0) return "Cuero";
        return "N/A";
    }

    public int getMaterial1Amount() {
        if (bars > 0) return bars;
        if (wood > 0) return wood;
        if (cloth > 0) return cloth;
        if (leather > 0) return leather;
        return 0;
    }

    // ==========================================
    // MATERIAL 2
    // ==========================================

    public String getMaterial2Name() {
        int count = 0;
        if (bars > 0) count++;
        if (wood > 0) count++;
        if (cloth > 0) count++;
        if (leather > 0) count++;

        if (count < 2) return "N/A";

        boolean firstFound = false;
        if (bars > 0) {
            firstFound = true;
        }

        if (wood > 0) {
            if (firstFound) return "Tabla";
            firstFound = true;
        }
        if (cloth > 0) {
            if (firstFound) return "Tela";
            firstFound = true;
        }
        if (leather > 0) {
            if (firstFound) return "Cuero";
        }
        return "N/A";
    }

    public int getMaterial2Amount() {
        int count = 0;
        if (bars > 0) count++;
        if (wood > 0) count++;
        if (cloth > 0) count++;
        if (leather > 0) count++;

        if (count < 2) return 0;

        boolean firstFound = false;
        if (bars > 0) {
            firstFound = true;
        }

        if (wood > 0) {
            if (firstFound) return wood;
            firstFound = true;
        }
        if (cloth > 0) {
            if (firstFound) return cloth;
            firstFound = true;
        }
        if (leather > 0) {
            if (firstFound) return leather;
        }
        return 0;
    }
}