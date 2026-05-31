package panels;

/**
 *
 * @author vehuiah
 */

import database.HerreroData;
import model.CraftItem;
import javax.swing.ImageIcon;
import java.awt.Image;
import database.HerreroMagicoData;
import database.FlecheroData;
import database.HojalateroData;
import java.util.List;
import model.Calculos;



public class CraftingPanel extends javax.swing.JPanel {

    /**
     * Creates new form CraftingPanel2
     */
    public CraftingPanel() {
        initComponents();
         loadItemsByCategory();
          loadItemImage();
          updateCraftAmounts();
       
    }
 
 
    private void loadItemsByCategory() {

    cmbItem.removeAllItems();

    String selectedCategory =
            cmbCategory.getSelectedItem().toString();

    // HERRERO
    if (selectedCategory.equals("Herrero")) {

        for (CraftItem item : HerreroData.items) {

            cmbItem.addItem(
                    item.getItemName()
            );

        }

    }

    // HERRERO MAGICO
    else if (selectedCategory.equals("Herrero Magico")) {

        for (CraftItem item : HerreroMagicoData.items) {

            cmbItem.addItem(
                    item.getItemName()
            );

        }

    }

    // FLECHERO
    else if (selectedCategory.equals("Flechero")) {

        for (CraftItem item : FlecheroData.items) {

            cmbItem.addItem(
                    item.getItemName()
            );

        }

    }

    // HOJALATERO
    else if (selectedCategory.equals("Hojalatero")) {

        for (CraftItem item : HojalateroData.items) {

            cmbItem.addItem(
                    item.getItemName()
            );

        }

    }

    loadItemImage();

}
    
    private java.util.List<CraftItem> getCurrentItems() {

    String selectedCategory =
            cmbCategory.getSelectedItem().toString();

    if (selectedCategory.equals("Herrero")) {
        return HerreroData.items;
    }

    if (selectedCategory.equals("Herrero Magico")) {
        return HerreroMagicoData.items;
    }

    if (selectedCategory.equals("Flechero")) {
        return FlecheroData.items;
    }

    if (selectedCategory.equals("Hojalatero")) {
        return HojalateroData.items;
    }

    return HerreroData.items;
}
    
    
    
   private void loadItemImage() {

    System.out.println("LOAD IMAGE");

    if (cmbItem.getSelectedItem() == null) {
        return;
    }

    String selectedItem =
            cmbItem.getSelectedItem().toString();

    String selectedTier =
            cmbTier.getSelectedItem().toString();

    String selectedEnchant =
            cmbEnchant.getSelectedItem().toString();

    String selectedCategory =
            cmbCategory.getSelectedItem().toString();

    java.util.List<CraftItem> itemList = null;
    String folder = "";

    switch (selectedCategory) {

        case "Herrero":
            itemList = HerreroData.items;
            folder = "herrero";
            break;

        case "Herrero Magico":
            itemList = HerreroMagicoData.items;
            folder = "herreromagico";
            break;

        case "Flechero":
            itemList = FlecheroData.items;
            folder = "flechero";
            break;

        case "Hojalatero":
            itemList = HojalateroData.items;
            folder = "hojalatero";
            break;
    }

    if (itemList == null) {
        return;
    }

    for (CraftItem item : itemList) {

        if (item.getItemName().equals(selectedItem)) {

            String imageName =
                    item.getItemImage();

            imageName =
                    imageName.replace("T4", selectedTier);

            if (!selectedEnchant.equals(".0")) {

                String enchantLevel =
                        selectedEnchant.replace(".", "");

                imageName =
                        imageName + "@" + enchantLevel;
            }

            imageName += ".png";

            java.net.URL imageURL =
                    getClass().getResource(
                            "/resources/" + folder + "/" + imageName
                    );

            System.out.println(imageURL);

            if (imageURL == null) {

                System.out.println("NO EXISTE LA IMAGEN");
                lblItemImage.setIcon(null);
                return;
            }

            ImageIcon icon =
                    new ImageIcon(imageURL);

            Image image =
                    icon.getImage().getScaledInstance(
                            120,
                            120,
                            Image.SCALE_SMOOTH
                    );

            lblItemImage.setIcon(
                    new ImageIcon(image)
            );

            lblItemName.setText(selectedItem);

            lblItemImage.repaint();
            lblItemImage.revalidate();

            loadMaterials();
            loadArtifact();

            break;
        }
    }
}
   
  private void loadMaterials() {

    if (cmbItem.getSelectedItem() == null) {
        return;
    }

    String selectedItem =
            cmbItem.getSelectedItem().toString();

    String selectedTier =
            cmbTier.getSelectedItem().toString();

    String selectedEnchant =
            cmbEnchant.getSelectedItem().toString();

    for (CraftItem item : getCurrentItems()) {

        if (item.getItemName().equals(selectedItem)) {

            // =========================
            // MATERIAL 1
            // =========================

            loadSingleMaterial(
                    item.getMaterial1Name(),
                    item.getMaterial1Amount(),
                    lblMaterial1Image,
                    lblMaterial1Quantity,
                    selectedTier,
                    selectedEnchant
            );

            // =========================
            // MATERIAL 2
            // =========================

            loadSingleMaterial(
                    item.getMaterial2Name(),
                    item.getMaterial2Amount(),
                    lblMaterial2Image,
                    lblMaterial2Quantity,
                    selectedTier,
                    selectedEnchant
            );

        }

    }

}
  
  private void loadSingleMaterial(
        String materialName,
        int amount,
        javax.swing.JLabel imageLabel,
        javax.swing.JLabel quantityLabel,
        String selectedTier,
        String selectedEnchant
) {

    quantityLabel.setText(
            materialName + " x" + amount
    );

    if (materialName.equals("N/A")) {

        imageLabel.setIcon(null);
        return;
    }

    String materialCode = "";

    switch (materialName) {

        case "Lingote":
            materialCode = "METALBAR";
            break;

        case "Tabla":
            materialCode = "PLANKS";
            break;

        case "Tela":
            materialCode = "CLOTH";
            break;

        case "Cuero":
            materialCode = "LEATHER";
            break;
    }

    String imageName =
            selectedTier + "_"
            + materialCode;

   if (!selectedEnchant.equals(".0")) {

    String enchant =
            selectedEnchant.replace(".", "");

    imageName += "_LEVEL" + enchant;
}

    imageName += ".png";

    System.out.println(imageName);

    java.net.URL imageURL =
            getClass().getResource(
                    "/resources/materials/"
                    + imageName
            );

    System.out.println(imageURL);

    if (imageURL == null) {

        System.out.println("NO EXISTE MATERIAL");
        return;
    }

    ImageIcon icon =
            new ImageIcon(imageURL);

    Image image =
            icon.getImage().getScaledInstance(
                    80,
                    80,
                    Image.SCALE_SMOOTH
            );

    imageLabel.setIcon(
            new ImageIcon(image)
    );
}
   
   private void loadMaterialSlot(
        int slot,
        String selectedTier,
        String selectedEnchant,
        String materialType,
        int amount
) {

    String imageName =
            selectedTier
            + "_"
            + materialType;

    if (!selectedEnchant.equals(".0")) {

        String enchantLevel =
                selectedEnchant.replace(".", "");

       imageName =
        imageName + "_LEVEL" + enchantLevel;
    }

    imageName += ".png";

    java.net.URL imageURL =
            getClass().getResource(
                    "/resources/materials/"
                    + imageName
            );

    if (imageURL == null) {
        return;
    }

    ImageIcon icon =
            new ImageIcon(imageURL);

    Image image =
            icon.getImage().getScaledInstance(
                    80,
                    80,
                    Image.SCALE_SMOOTH
            );

    if (slot == 1) {

        lblMaterial1Image.setIcon(
                new ImageIcon(image)
        );

        lblMaterial1Quantity.setText(
                "x" + amount
        );

    }

    if (slot == 2) {

        lblMaterial2Image.setIcon(
                new ImageIcon(image)
        );

        lblMaterial2Quantity.setText(
                "x" + amount
        );

    }

}
   
   
private void loadArtifact() {

    lblArtifactImage.setIcon(null);
    lblArtifactName.setText("");
    lblArtifactQuantity.setText("");

    if (cmbItem.getSelectedItem() == null) {
        return;
    }

    String selectedItem =
            cmbItem.getSelectedItem().toString();

    String selectedTier =
            cmbTier.getSelectedItem().toString();

    for (CraftItem item : getCurrentItems()) {

        if (item.getItemName().equals(selectedItem)) {

            // =========================
            // VALIDAR SI TIENE ARTEFACTO
            // =========================

            if (item.getArtifactAmount() <= 0) {

                return;
            }

            // =========================
            // NOMBRE EN ESPAÑOL
            // =========================

            String artifactName =
                    item.getArtifactName();

            // =========================
            // NOMBRE BASE IMAGEN
            // =========================

            String imageName =
                    item.getArtifactImage();

            // SI NO TIENE ARTEFACT_

            if (!imageName.contains("ARTEFACT")) {

                imageName =
                        "ARTEFACT_"
                        + imageName;
            }

            // SI NO TIENE TIER

            if (!imageName.startsWith("T")) {

                imageName =
                        selectedTier
                        + "_"
                        + imageName;
            }

            // CAMBIAR TIER

            imageName =
                    imageName.replaceFirst(
                            "T[4-8]",
                            selectedTier
                    );

            imageName += ".png";

            System.out.println(imageName);

            // =========================
            // CARGAR IMAGEN
            // =========================

            java.net.URL imageURL =
                    getClass().getResource(
                            "/resources/artifacts/"
                            + imageName
                    );

            System.out.println(imageURL);

            if (imageURL == null) {

                System.out.println(
                        "NO EXISTE ARTEFACTO"
                );

                return;
            }

            ImageIcon icon =
                    new ImageIcon(imageURL);

            Image image =
                    icon.getImage().getScaledInstance(
                            80,
                            80,
                            Image.SCALE_SMOOTH
                    );

            lblArtifactImage.setIcon(
                    new ImageIcon(image)
            );

            // =========================
            // MOSTRAR DATOS
            // =========================

            lblArtifactName.setText(
                    artifactName
            );

            lblArtifactQuantity.setText(
                    "x"
                    + item.getArtifactAmount()
            );

            lblArtifactImage.repaint();
            lblArtifactImage.revalidate();

            break;
        }
    }
}





private void updateCraftAmounts() {

    CraftItem item =
            getSelectedCraftItem();

    if (item == null) {
        return;
    }

    int amount = 1;

    try {

        amount =
                Integer.parseInt(
                        txtAmount.getText()
                );

    } catch (Exception e) {

        amount = 1;
    }

    int material1 =
            Calculos.calcularCantidad(
                    item.getMaterial1Amount(),
                    amount
            );

    int material2 =
            Calculos.calcularCantidad(
                    item.getMaterial2Amount(),
                    amount
            );

    int artefacto =
            Calculos.calcularCantidad(
                    item.getArtifactAmount(),
                    amount
            );

    lblMaterial1Quantity.setText(
            item.getMaterial1Name()
            + " x"
            + material1
    );

    lblMaterial2Quantity.setText(
            item.getMaterial2Name()
            + " x"
            + material2
    );

    lblArtifactQuantity.setText(
            "x" + artefacto
    );

    lblRestQuantity.setText(
            "x" + artefacto
    );
}

private CraftItem getSelectedCraftItem() {

    if (cmbItem.getSelectedItem() == null) {
        return null;
    }

    String selectedItem =
            cmbItem.getSelectedItem().toString();

    for (CraftItem item : getCurrentItems()) {

        if (item.getItemName().equals(selectedItem)) {
            return item;
        }
    }

    return null;
}



    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        panelSelector = new javax.swing.JPanel();
        lblCategory = new javax.swing.JLabel();
        cmbCategory = new javax.swing.JComboBox<>();
        lblItem = new javax.swing.JLabel();
        cmbItem = new javax.swing.JComboBox<>();
        lblTier = new javax.swing.JLabel();
        cmbTier = new javax.swing.JComboBox<>();
        lblEnchant = new javax.swing.JLabel();
        cmbEnchant = new javax.swing.JComboBox<>();
        lblAmount = new javax.swing.JLabel();
        txtAmount = new javax.swing.JTextField();
        panelItemPreview = new javax.swing.JPanel();
        lblItemImage = new javax.swing.JLabel();
        lblItemName = new javax.swing.JLabel();
        lblProfit = new javax.swing.JLabel();
        panelCitiesMarket = new javax.swing.JPanel();
        cardLymhurst = new javax.swing.JPanel();
        lblLymhurst = new javax.swing.JLabel();
        chkSellLymhurst = new javax.swing.JCheckBox();
        txtLymhurstSellPrice = new javax.swing.JTextField();
        lblLymhurstApi = new javax.swing.JLabel();
        cardThetford = new javax.swing.JPanel();
        lblThetford = new javax.swing.JLabel();
        txtThetfordSellPrice = new javax.swing.JTextField();
        lblThetfordApi = new javax.swing.JLabel();
        chkSellThetford = new javax.swing.JCheckBox();
        cardFortSterling = new javax.swing.JPanel();
        lblFortSterling = new javax.swing.JLabel();
        txtFortSterlingSellPrice = new javax.swing.JTextField();
        lblFortSterlingApi = new javax.swing.JLabel();
        chkSellFortSterling = new javax.swing.JCheckBox();
        cardMartlock = new javax.swing.JPanel();
        lblMartlock = new javax.swing.JLabel();
        txtMartlockSellPrice = new javax.swing.JTextField();
        lblMartlockApi = new javax.swing.JLabel();
        chkSellMartlock = new javax.swing.JCheckBox();
        cardBridgewatch = new javax.swing.JPanel();
        lblBridgewatch = new javax.swing.JLabel();
        txtBridgewatchSellPrice = new javax.swing.JTextField();
        lblBridgewatchApi = new javax.swing.JLabel();
        chkSellBridgewatch = new javax.swing.JCheckBox();
        cardCaerleon = new javax.swing.JPanel();
        lblCaerleon = new javax.swing.JLabel();
        txtCaerleonSellPrice = new javax.swing.JTextField();
        lblCaerleonApi = new javax.swing.JLabel();
        chkSellCaerleon = new javax.swing.JCheckBox();
        jPanel1 = new javax.swing.JPanel();
        lblBlackMarket = new javax.swing.JLabel();
        txtBlackMarketSellPrice = new javax.swing.JTextField();
        lblBlackMarketApi = new javax.swing.JLabel();
        chkSellBlackMarket = new javax.swing.JCheckBox();
        panelMaterials = new javax.swing.JPanel();
        panelRest = new javax.swing.JPanel();
        lblRestBestApi = new javax.swing.JLabel();
        lblRestBestPrice = new javax.swing.JLabel();
        lblRestQuantity = new javax.swing.JLabel();
        lblRestImage = new javax.swing.JLabel();
        panelMaterial1 = new javax.swing.JPanel();
        lblMaterial1Image = new javax.swing.JLabel();
        lblMaterial1Quantity = new javax.swing.JLabel();
        lblMaterial1BestPrice = new javax.swing.JLabel();
        lblMaterial1BestApi = new javax.swing.JLabel();
        panelMaterial2 = new javax.swing.JPanel();
        lblMaterial2Image = new javax.swing.JLabel();
        lblMaterial2Quantity = new javax.swing.JLabel();
        lblMaterial2BestPrice = new javax.swing.JLabel();
        lblMaterial2BestApi = new javax.swing.JLabel();
        panelArtifact = new javax.swing.JPanel();
        lblArtifactBestApi = new javax.swing.JLabel();
        lblArtifactBestPrice = new javax.swing.JLabel();
        lblArtifactQuantity = new javax.swing.JLabel();
        lblArtifactImage = new javax.swing.JLabel();
        lblArtifactName = new javax.swing.JLabel();

        setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        panelSelector.setBackground(new java.awt.Color(22, 22, 30));
        panelSelector.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 255, 180), 2));
        panelSelector.setForeground(new java.awt.Color(255, 255, 255));
        panelSelector.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblCategory.setForeground(new java.awt.Color(220, 220, 220));
        lblCategory.setText("Categoria");
        panelSelector.add(lblCategory, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 25, 100, 30));

        cmbCategory.setBackground(new java.awt.Color(35, 35, 45));
        cmbCategory.setForeground(new java.awt.Color(255, 255, 255));
        cmbCategory.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Herrero", "Herrero Magico", "Flechero", "Hojalatero" }));
        cmbCategory.setBorder(javax.swing.BorderFactory.createTitledBorder(""));
        cmbCategory.addActionListener(this::cmbCategoryActionPerformed);
        panelSelector.add(cmbCategory, new org.netbeans.lib.awtextra.AbsoluteConstraints(140, 20, 240, 38));

        lblItem.setForeground(new java.awt.Color(220, 220, 220));
        lblItem.setText("item");
        panelSelector.add(lblItem, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 75, 100, 30));

        cmbItem.setBackground(new java.awt.Color(35, 35, 45));
        cmbItem.setForeground(new java.awt.Color(255, 255, 255));
        cmbItem.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Item 1", "Item 2", "Item 3", "Item 4" }));
        cmbItem.addActionListener(this::cmbItemActionPerformed);
        panelSelector.add(cmbItem, new org.netbeans.lib.awtextra.AbsoluteConstraints(140, 70, 240, 38));

        lblTier.setForeground(new java.awt.Color(220, 220, 220));
        lblTier.setText("tier");
        panelSelector.add(lblTier, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 125, 100, 30));

        cmbTier.setBackground(new java.awt.Color(35, 35, 45));
        cmbTier.setForeground(new java.awt.Color(255, 255, 255));
        cmbTier.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "T4", "T5", "T6", "T7", "T8" }));
        cmbTier.addActionListener(this::cmbTierActionPerformed);
        panelSelector.add(cmbTier, new org.netbeans.lib.awtextra.AbsoluteConstraints(140, 120, 100, 38));

        lblEnchant.setForeground(new java.awt.Color(220, 220, 220));
        lblEnchant.setText("Encantamiento");
        panelSelector.add(lblEnchant, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 175, 110, 30));

        cmbEnchant.setBackground(new java.awt.Color(35, 35, 45));
        cmbEnchant.setForeground(new java.awt.Color(255, 255, 255));
        cmbEnchant.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { ".0", ".1", ".2", ".3", ".4" }));
        cmbEnchant.addActionListener(this::cmbEnchantActionPerformed);
        panelSelector.add(cmbEnchant, new org.netbeans.lib.awtextra.AbsoluteConstraints(140, 170, 100, 38));

        lblAmount.setForeground(new java.awt.Color(220, 220, 220));
        lblAmount.setText("Cantidad");
        panelSelector.add(lblAmount, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 225, 100, 38));

        txtAmount.setBackground(new java.awt.Color(35, 35, 45));
        txtAmount.setForeground(new java.awt.Color(255, 255, 255));
        txtAmount.setText("1");
        txtAmount.addActionListener(this::txtAmountActionPerformed);
        txtAmount.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                txtAmountKeyReleased(evt);
            }
        });
        panelSelector.add(txtAmount, new org.netbeans.lib.awtextra.AbsoluteConstraints(140, 220, 100, 38));

        add(panelSelector, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 20, 420, 300));

        panelItemPreview.setBackground(new java.awt.Color(22, 22, 30));
        panelItemPreview.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 180, 255)));
        panelItemPreview.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblItemImage.setBackground(new java.awt.Color(40, 40, 50));
        lblItemImage.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblItemImage.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 255, 180)));
        lblItemImage.setPreferredSize(new java.awt.Dimension(120, 120));
        panelItemPreview.add(lblItemImage, new org.netbeans.lib.awtextra.AbsoluteConstraints(40, 20, 180, 180));

        lblItemName.setForeground(new java.awt.Color(255, 255, 255));
        lblItemName.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblItemName.setText("Nombre Item");
        panelItemPreview.add(lblItemName, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 215, 220, 30));

        lblProfit.setBackground(new java.awt.Color(0, 255, 180));
        lblProfit.setForeground(new java.awt.Color(255, 255, 255));
        lblProfit.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblProfit.setText("Profit: 0");
        panelItemPreview.add(lblProfit, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 255, 220, 30));

        add(panelItemPreview, new org.netbeans.lib.awtextra.AbsoluteConstraints(470, 20, 260, 300));

        panelCitiesMarket.setBackground(new java.awt.Color(22, 22, 30));
        panelCitiesMarket.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(255, 120, 0), 2));
        panelCitiesMarket.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        cardLymhurst.setBackground(new java.awt.Color(0, 180, 80));
        cardLymhurst.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblLymhurst.setForeground(new java.awt.Color(255, 255, 255));
        lblLymhurst.setText("Lymhurst");
        cardLymhurst.add(lblLymhurst, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 10, -1, -1));

        chkSellLymhurst.setForeground(new java.awt.Color(255, 255, 255));
        chkSellLymhurst.setText("vender");
        cardLymhurst.add(chkSellLymhurst, new org.netbeans.lib.awtextra.AbsoluteConstraints(160, 10, -1, -1));
        cardLymhurst.add(txtLymhurstSellPrice, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 45, 120, 30));

        lblLymhurstApi.setForeground(new java.awt.Color(255, 255, 255));
        lblLymhurstApi.setText("API");
        cardLymhurst.add(lblLymhurstApi, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 80, 180, 20));

        panelCitiesMarket.add(cardLymhurst, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 20, 230, 110));

        cardThetford.setBackground(new java.awt.Color(170, 80, 255));
        cardThetford.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblThetford.setForeground(new java.awt.Color(255, 255, 255));
        lblThetford.setText("Thetford");
        cardThetford.add(lblThetford, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 10, -1, -1));
        cardThetford.add(txtThetfordSellPrice, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 45, 120, 30));

        lblThetfordApi.setForeground(new java.awt.Color(255, 255, 255));
        lblThetfordApi.setText("API");
        cardThetford.add(lblThetfordApi, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 80, 180, 20));

        chkSellThetford.setForeground(new java.awt.Color(255, 255, 255));
        chkSellThetford.setText("vender");
        cardThetford.add(chkSellThetford, new org.netbeans.lib.awtextra.AbsoluteConstraints(160, 10, -1, -1));

        panelCitiesMarket.add(cardThetford, new org.netbeans.lib.awtextra.AbsoluteConstraints(270, 20, 230, 110));

        cardFortSterling.setBackground(new java.awt.Color(220, 220, 220));
        cardFortSterling.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblFortSterling.setForeground(new java.awt.Color(255, 255, 255));
        lblFortSterling.setText("Fort Sterling");
        cardFortSterling.add(lblFortSterling, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 10, -1, -1));
        cardFortSterling.add(txtFortSterlingSellPrice, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 45, 120, 30));

        lblFortSterlingApi.setForeground(new java.awt.Color(255, 255, 255));
        lblFortSterlingApi.setText("API");
        cardFortSterling.add(lblFortSterlingApi, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 80, 180, 20));

        chkSellFortSterling.setForeground(new java.awt.Color(255, 255, 255));
        chkSellFortSterling.setText("vender");
        cardFortSterling.add(chkSellFortSterling, new org.netbeans.lib.awtextra.AbsoluteConstraints(160, 10, -1, -1));

        panelCitiesMarket.add(cardFortSterling, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 150, 230, 110));

        cardMartlock.setBackground(new java.awt.Color(0, 140, 255));
        cardMartlock.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblMartlock.setForeground(new java.awt.Color(255, 255, 255));
        lblMartlock.setText("Martlock");
        cardMartlock.add(lblMartlock, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 10, -1, -1));
        cardMartlock.add(txtMartlockSellPrice, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 45, 120, 30));

        lblMartlockApi.setForeground(new java.awt.Color(255, 255, 255));
        lblMartlockApi.setText("API");
        cardMartlock.add(lblMartlockApi, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 80, 180, 20));

        chkSellMartlock.setForeground(new java.awt.Color(255, 255, 255));
        chkSellMartlock.setText("vender");
        cardMartlock.add(chkSellMartlock, new org.netbeans.lib.awtextra.AbsoluteConstraints(160, 10, -1, -1));

        panelCitiesMarket.add(cardMartlock, new org.netbeans.lib.awtextra.AbsoluteConstraints(270, 150, 230, 110));

        cardBridgewatch.setBackground(new java.awt.Color(255, 140, 0));
        cardBridgewatch.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblBridgewatch.setForeground(new java.awt.Color(255, 255, 255));
        lblBridgewatch.setText("Bridgewatch");
        cardBridgewatch.add(lblBridgewatch, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 10, -1, -1));
        cardBridgewatch.add(txtBridgewatchSellPrice, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 45, 120, 30));

        lblBridgewatchApi.setForeground(new java.awt.Color(255, 255, 255));
        lblBridgewatchApi.setText("API");
        cardBridgewatch.add(lblBridgewatchApi, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 80, 180, 20));

        chkSellBridgewatch.setForeground(new java.awt.Color(255, 255, 255));
        chkSellBridgewatch.setText("vender");
        cardBridgewatch.add(chkSellBridgewatch, new org.netbeans.lib.awtextra.AbsoluteConstraints(160, 10, -1, -1));

        panelCitiesMarket.add(cardBridgewatch, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 280, 230, 110));

        cardCaerleon.setBackground(new java.awt.Color(255, 40, 40));
        cardCaerleon.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblCaerleon.setForeground(new java.awt.Color(255, 255, 255));
        lblCaerleon.setText("Caerleon");
        cardCaerleon.add(lblCaerleon, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 10, -1, -1));
        cardCaerleon.add(txtCaerleonSellPrice, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 45, 120, 30));

        lblCaerleonApi.setForeground(new java.awt.Color(255, 255, 255));
        lblCaerleonApi.setText("API");
        cardCaerleon.add(lblCaerleonApi, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 80, 180, 20));

        chkSellCaerleon.setForeground(new java.awt.Color(255, 255, 255));
        chkSellCaerleon.setText("vender");
        cardCaerleon.add(chkSellCaerleon, new org.netbeans.lib.awtextra.AbsoluteConstraints(160, 10, -1, -1));

        panelCitiesMarket.add(cardCaerleon, new org.netbeans.lib.awtextra.AbsoluteConstraints(270, 280, 230, 110));

        jPanel1.setBackground(new java.awt.Color(255, 0, 120));
        jPanel1.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblBlackMarket.setForeground(new java.awt.Color(255, 255, 255));
        lblBlackMarket.setText("BlackMarket");
        jPanel1.add(lblBlackMarket, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 10, -1, -1));
        jPanel1.add(txtBlackMarketSellPrice, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 45, 120, 30));

        lblBlackMarketApi.setForeground(new java.awt.Color(255, 255, 255));
        lblBlackMarketApi.setText("API");
        jPanel1.add(lblBlackMarketApi, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 80, 180, 20));

        chkSellBlackMarket.setForeground(new java.awt.Color(255, 255, 255));
        chkSellBlackMarket.setText("vender");
        jPanel1.add(chkSellBlackMarket, new org.netbeans.lib.awtextra.AbsoluteConstraints(160, 10, -1, -1));

        panelCitiesMarket.add(jPanel1, new org.netbeans.lib.awtextra.AbsoluteConstraints(145, 420, 230, 110));

        add(panelCitiesMarket, new org.netbeans.lib.awtextra.AbsoluteConstraints(750, 10, 520, 550));

        panelMaterials.setBackground(new java.awt.Color(22, 22, 30));
        panelMaterials.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(180, 0, 255), 2));
        panelMaterials.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        panelRest.setBackground(new java.awt.Color(30, 30, 40));
        panelRest.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 255, 180)));
        panelRest.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblRestBestApi.setForeground(new java.awt.Color(120, 120, 255));
        lblRestBestApi.setText("API");
        panelRest.add(lblRestBestApi, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 185, 180, 25));

        lblRestBestPrice.setForeground(new java.awt.Color(0, 255, 180));
        lblRestBestPrice.setText("Precio");
        panelRest.add(lblRestBestPrice, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 155, 180, 25));

        lblRestQuantity.setForeground(new java.awt.Color(255, 255, 255));
        lblRestQuantity.setText("Cantidad");
        panelRest.add(lblRestQuantity, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 125, 180, 25));

        lblRestImage.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblRestImage.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 255, 255)));
        lblRestImage.setPreferredSize(new java.awt.Dimension(180, 180));
        panelRest.add(lblRestImage, new org.netbeans.lib.awtextra.AbsoluteConstraints(60, 10, 100, 100));

        panelMaterials.add(panelRest, new org.netbeans.lib.awtextra.AbsoluteConstraints(740, 20, 220, 220));

        panelMaterial1.setBackground(new java.awt.Color(30, 30, 40));
        panelMaterial1.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 255, 180)));
        panelMaterial1.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblMaterial1Image.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblMaterial1Image.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 255, 255)));
        lblMaterial1Image.setPreferredSize(new java.awt.Dimension(120, 120));
        panelMaterial1.add(lblMaterial1Image, new org.netbeans.lib.awtextra.AbsoluteConstraints(60, 10, 100, 100));

        lblMaterial1Quantity.setForeground(new java.awt.Color(255, 255, 255));
        lblMaterial1Quantity.setText("Cantidad");
        panelMaterial1.add(lblMaterial1Quantity, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 125, 180, 25));

        lblMaterial1BestPrice.setForeground(new java.awt.Color(0, 255, 180));
        lblMaterial1BestPrice.setText("Precio");
        panelMaterial1.add(lblMaterial1BestPrice, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 155, 180, 25));

        lblMaterial1BestApi.setForeground(new java.awt.Color(120, 120, 255));
        lblMaterial1BestApi.setText("API");
        panelMaterial1.add(lblMaterial1BestApi, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 185, 180, 25));

        panelMaterials.add(panelMaterial1, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 20, 220, 220));

        panelMaterial2.setBackground(new java.awt.Color(30, 30, 40));
        panelMaterial2.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 255, 180)));
        panelMaterial2.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblMaterial2Image.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblMaterial2Image.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 255, 255)));
        lblMaterial2Image.setPreferredSize(new java.awt.Dimension(120, 120));
        panelMaterial2.add(lblMaterial2Image, new org.netbeans.lib.awtextra.AbsoluteConstraints(60, 10, 100, 100));

        lblMaterial2Quantity.setForeground(new java.awt.Color(255, 255, 255));
        lblMaterial2Quantity.setText("Cantidad");
        panelMaterial2.add(lblMaterial2Quantity, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 125, 180, 25));

        lblMaterial2BestPrice.setForeground(new java.awt.Color(0, 255, 180));
        lblMaterial2BestPrice.setText("Precio");
        panelMaterial2.add(lblMaterial2BestPrice, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 155, 180, 25));

        lblMaterial2BestApi.setForeground(new java.awt.Color(120, 120, 255));
        lblMaterial2BestApi.setText("API");
        panelMaterial2.add(lblMaterial2BestApi, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 185, 180, 25));

        panelMaterials.add(panelMaterial2, new org.netbeans.lib.awtextra.AbsoluteConstraints(260, 20, 220, 220));

        panelArtifact.setBackground(new java.awt.Color(30, 30, 40));
        panelArtifact.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 255, 180)));
        panelArtifact.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblArtifactBestApi.setForeground(new java.awt.Color(120, 120, 255));
        lblArtifactBestApi.setText("API");
        panelArtifact.add(lblArtifactBestApi, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 185, 180, 25));

        lblArtifactBestPrice.setForeground(new java.awt.Color(0, 255, 180));
        lblArtifactBestPrice.setText("Precio");
        panelArtifact.add(lblArtifactBestPrice, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 160, 180, 25));

        lblArtifactQuantity.setForeground(new java.awt.Color(255, 255, 255));
        lblArtifactQuantity.setText("Cantidad");
        panelArtifact.add(lblArtifactQuantity, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 140, 180, 25));

        lblArtifactImage.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblArtifactImage.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 255, 255)));
        lblArtifactImage.setPreferredSize(new java.awt.Dimension(180, 180));
        panelArtifact.add(lblArtifactImage, new org.netbeans.lib.awtextra.AbsoluteConstraints(60, 10, 100, 100));

        lblArtifactName.setForeground(new java.awt.Color(255, 255, 255));
        lblArtifactName.setText("jLabel1");
        panelArtifact.add(lblArtifactName, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 110, 170, 30));
        lblArtifactName.getAccessibleContext().setAccessibleDescription("");

        panelMaterials.add(panelArtifact, new org.netbeans.lib.awtextra.AbsoluteConstraints(500, 20, 220, 220));

        add(panelMaterials, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 570, 1000, 260));
    }// </editor-fold>//GEN-END:initComponents

    private void cmbCategoryActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cmbCategoryActionPerformed
    loadItemsByCategory();    // TODO add your handling code here:
    }//GEN-LAST:event_cmbCategoryActionPerformed

    private void cmbItemActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cmbItemActionPerformed

    loadItemImage();       // TODO add your handling code here:
    }//GEN-LAST:event_cmbItemActionPerformed

    private void cmbTierActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cmbTierActionPerformed
     
     loadItemImage(); 
    
        // TODO add your handling code here:
    }//GEN-LAST:event_cmbTierActionPerformed

    private void cmbEnchantActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cmbEnchantActionPerformed
       loadItemImage(); // TODO add your handling code here:
    }//GEN-LAST:event_cmbEnchantActionPerformed

    private void txtAmountActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_txtAmountActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_txtAmountActionPerformed

    private void txtAmountKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_txtAmountKeyReleased
     
    updateCraftAmounts();   // aqui es para detectar la cantidad
    }//GEN-LAST:event_txtAmountKeyReleased


    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JPanel cardBridgewatch;
    private javax.swing.JPanel cardCaerleon;
    private javax.swing.JPanel cardFortSterling;
    private javax.swing.JPanel cardLymhurst;
    private javax.swing.JPanel cardMartlock;
    private javax.swing.JPanel cardThetford;
    private javax.swing.JCheckBox chkSellBlackMarket;
    private javax.swing.JCheckBox chkSellBridgewatch;
    private javax.swing.JCheckBox chkSellCaerleon;
    private javax.swing.JCheckBox chkSellFortSterling;
    private javax.swing.JCheckBox chkSellLymhurst;
    private javax.swing.JCheckBox chkSellMartlock;
    private javax.swing.JCheckBox chkSellThetford;
    private javax.swing.JComboBox<String> cmbCategory;
    private javax.swing.JComboBox<String> cmbEnchant;
    private javax.swing.JComboBox<String> cmbItem;
    private javax.swing.JComboBox<String> cmbTier;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JLabel lblAmount;
    private javax.swing.JLabel lblArtifactBestApi;
    private javax.swing.JLabel lblArtifactBestPrice;
    private javax.swing.JLabel lblArtifactImage;
    private javax.swing.JLabel lblArtifactName;
    private javax.swing.JLabel lblArtifactQuantity;
    private javax.swing.JLabel lblBlackMarket;
    private javax.swing.JLabel lblBlackMarketApi;
    private javax.swing.JLabel lblBridgewatch;
    private javax.swing.JLabel lblBridgewatchApi;
    private javax.swing.JLabel lblCaerleon;
    private javax.swing.JLabel lblCaerleonApi;
    private javax.swing.JLabel lblCategory;
    private javax.swing.JLabel lblEnchant;
    private javax.swing.JLabel lblFortSterling;
    private javax.swing.JLabel lblFortSterlingApi;
    private javax.swing.JLabel lblItem;
    private javax.swing.JLabel lblItemImage;
    private javax.swing.JLabel lblItemName;
    private javax.swing.JLabel lblLymhurst;
    private javax.swing.JLabel lblLymhurstApi;
    private javax.swing.JLabel lblMartlock;
    private javax.swing.JLabel lblMartlockApi;
    private javax.swing.JLabel lblMaterial1BestApi;
    private javax.swing.JLabel lblMaterial1BestPrice;
    private javax.swing.JLabel lblMaterial1Image;
    private javax.swing.JLabel lblMaterial1Quantity;
    private javax.swing.JLabel lblMaterial2BestApi;
    private javax.swing.JLabel lblMaterial2BestPrice;
    private javax.swing.JLabel lblMaterial2Image;
    private javax.swing.JLabel lblMaterial2Quantity;
    private javax.swing.JLabel lblProfit;
    private javax.swing.JLabel lblRestBestApi;
    private javax.swing.JLabel lblRestBestPrice;
    private javax.swing.JLabel lblRestImage;
    private javax.swing.JLabel lblRestQuantity;
    private javax.swing.JLabel lblThetford;
    private javax.swing.JLabel lblThetfordApi;
    private javax.swing.JLabel lblTier;
    private javax.swing.JPanel panelArtifact;
    private javax.swing.JPanel panelCitiesMarket;
    private javax.swing.JPanel panelItemPreview;
    private javax.swing.JPanel panelMaterial1;
    private javax.swing.JPanel panelMaterial2;
    private javax.swing.JPanel panelMaterials;
    private javax.swing.JPanel panelRest;
    private javax.swing.JPanel panelSelector;
    private javax.swing.JTextField txtAmount;
    private javax.swing.JTextField txtBlackMarketSellPrice;
    private javax.swing.JTextField txtBridgewatchSellPrice;
    private javax.swing.JTextField txtCaerleonSellPrice;
    private javax.swing.JTextField txtFortSterlingSellPrice;
    private javax.swing.JTextField txtLymhurstSellPrice;
    private javax.swing.JTextField txtMartlockSellPrice;
    private javax.swing.JTextField txtThetfordSellPrice;
    // End of variables declaration//GEN-END:variables
}