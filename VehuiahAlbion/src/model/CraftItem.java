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

    public String getItemName() {
        return itemName;
    }

    public String getArtisan() {
        return artisan;
    }

    public String getItemType() {
        return itemType;
    }

    public String getCategory() {
        return category;
    }

    public int getBars() {
        return bars;
    }

    public int getWood() {
        return wood;
    }

    public int getCloth() {
        return cloth;
    }

    public int getLeather() {
        return leather;
    }

    public String getArtifact1() {
        return artifact1;
    }

    public int getArtifact1Amount() {
        return artifact1Amount;
    }

    public String getItemImage() {
        return itemImage;
    }

    public String getArtifactImage() {
        return artifactImage;
    }
    
}
public String getArtifact1() {
    return artifact1;
}

public int getArtifact1Amount() {
    return artifact1Amount;
}

public String getItemImage() {
    return itemImage;
}

public String getArtifactImage() {
    return artifactImage;
}