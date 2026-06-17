package Paneles;

import database.DatabaseConnection;
import database.ItemData;
import java.net.URL;
import javax.swing.ImageIcon;
import java.awt.Image;

public class Crafteo extends javax.swing.JPanel {

    private String url_item;

    public Crafteo() {
        initComponents();

        // ✔ LISTENERS
        cbxTier.addActionListener(e -> refreshAll());
cbxEncantamiento.addActionListener(e -> refreshAll());
cbxItem.addActionListener(e -> refreshAll());

        // ✔ CARGA DESDE BD
        ItemData item = DatabaseConnection.obtenerItem("ESPADA DE SOLDADO T4");

        if (item != null) {
            System.out.println("ITEM CARGADO OK");
            System.out.println("URL_ITEM BD: " + item.getUrl_item());

            url_item = item.getUrl_item();
        } else {
            System.out.println("ITEM NULL DESDE BD");
        }

        // NO LLAMAR ANTES DE QUE LOS COMBOS TENGAN VALORES
        updateItemImage();
        
    }

    private void updateItemImage() {

        try {
            if (url_item == null || url_item.isEmpty()) {
                System.out.println("url_item NULL O VACÍO");
                return;
            }

            if (cbxTier.getSelectedItem() == null || cbxEncantamiento.getSelectedItem() == null) {
                System.out.println("COMBOS NO LISTOS AÚN");
                return;
            }

            String tier = cbxTier.getSelectedItem().toString().trim();
            String enchantText = cbxEncantamiento.getSelectedItem().toString().trim();

            System.out.println("TIER: " + tier);
            System.out.println("ENCHANT: " + enchantText);
            System.out.println("URL_ITEM: " + url_item);

            String itemCode;

            if (enchantText.equals(".0")) {
                itemCode = tier + "_" + url_item;
            } else {
                String enchant = enchantText.replace(".", "");
                itemCode = tier + "_" + url_item + "@" + enchant;
            }

            String imageUrl = "https://render.albiononline.com/v1/item/" + itemCode + ".png";

            System.out.println("ITEM CODE: " + itemCode);
            System.out.println("IMAGE URL: " + imageUrl);

            URL url = new URL(imageUrl);
            Image image = javax.imageio.ImageIO.read(url);

            if (image == null) {
                System.out.println("IMAGEN NULL (NO EXISTE EN ALBION)");
                return;
            }

            int w = lblImagenItem.getWidth();
            int h = lblImagenItem.getHeight();

            if (w <= 0 || h <= 0) {
                w = 64;
                h = 64;
            }

            Image scaled = image.getScaledInstance(w, h, Image.SCALE_SMOOTH);

            lblImagenItem.setIcon(new ImageIcon(scaled));

            System.out.println("IMAGEN CARGADA OK");

        } catch (Exception e) {
            System.out.println("ERROR EN UPDATE IMAGE");
            e.printStackTrace();
        }
    }
    
    
    
    
   private void setAlbionImage(javax.swing.JLabel label, String itemCode) {
    try {
        if (itemCode == null || itemCode.trim().isEmpty()) {
            label.setIcon(null);
            return;
        }

        String url = "https://render.albiononline.com/v1/item/" 
                   + itemCode.trim() + ".png";

        System.out.println("CARGANDO: " + url);

        java.net.URL u = new java.net.URL(url);

        javax.imageio.ImageReader reader =
            javax.imageio.ImageIO.getImageReadersByFormatName("png").next();

        java.awt.image.BufferedImage img = javax.imageio.ImageIO.read(u);

        if (img == null) {
            System.out.println("IMG NULL");
            label.setIcon(null);
            return;
        }

        int w = Math.max(label.getWidth(), 64);
        int h = Math.max(label.getHeight(), 64);

        java.awt.Image scaled = img.getScaledInstance(w, h, java.awt.Image.SCALE_SMOOTH);

        label.setIcon(new javax.swing.ImageIcon(scaled));

    } catch (Exception e) {
        e.printStackTrace();
        label.setIcon(null);
    }

    
    
    
    try {
    String url = "https://render.albiononline.com/v1/item/T4_SHOES_PLATE_SET1.png";
    System.out.println("TEST URL: " + url);

    Image img = javax.imageio.ImageIO.read(new java.net.URL(url));

    System.out.println("IMAGE NULL? " + (img == null));

} catch (Exception e) {
    e.printStackTrace();
}
}

    private void updateMaterials() {

    if (cbxItem.getSelectedItem() == null) {
        return;
    }

    ItemData item = DatabaseConnection.obtenerItem(cbxItem.getSelectedItem().toString());

    if (item == null) {
        return;
    }

    String tier = cbxTier.getSelectedItem().toString();

    String enchantText = cbxEncantamiento.getSelectedItem().toString();
    String level = "";
    if (!enchantText.equals(".0")) {
        level = "_LEVEL" + enchantText.replace(".", "");
    }

    // limpiar
    lblMaterial1.setIcon(null);
    lblMaterial2.setIcon(null);

    int slot = 1;

    if (item.lingotes > 0) {
        if (slot == 1) {
            setAlbionImage(lblMaterial1, tier + "_METALBAR" + level);
        } else {
            setAlbionImage(lblMaterial2, tier + "_METALBAR" + level);
        }
        slot++;
    }

    if (item.tablas > 0) {
        if (slot == 1) {
            setAlbionImage(lblMaterial1, tier + "_PLANKS" + level);
        } else {
            setAlbionImage(lblMaterial2, tier + "_PLANKS" + level);
        }
        slot++;
    }

    if (item.telas > 0) {
        if (slot == 1) {
            setAlbionImage(lblMaterial1, tier + "_CLOTH" + level);
        } else {
            setAlbionImage(lblMaterial2, tier + "_CLOTH" + level);
        }
        slot++;
    }

    if (item.cueros > 0) {
        if (slot == 1) {
            setAlbionImage(lblMaterial1, tier + "_LEATHER" + level);
        } else {
            setAlbionImage(lblMaterial2, tier + "_LEATHER" + level);
        }
        slot++;
    }
}
    
    
    private void updateArtefactos(ItemData item) {

    String tier = cbxTier.getSelectedItem().toString();

    // limpiar
    lblArtefacto1.setIcon(null);
    lblArtefacto2.setIcon(null);

    // ARTEFACTO 1
    if (item.artefacto1 != null && !item.artefacto1.trim().isEmpty()) {

        lblNombreArtefacto1.setText(item.artefacto1);
        lblCantidadArtefacto1.setText(String.valueOf(item.cantidadArtefacto1));

        String code1 = tier + "_ARTEFACT_" + item.url_artefacto_1;
        setAlbionImage(lblArtefacto1, code1);
    }

    // ARTEFACTO 2
    if (item.artefacto2 != null && !item.artefacto2.trim().isEmpty()) {

        lblNombreArtefacto2.setText(item.artefacto2);
        lblCantidadArtefacto2.setText(String.valueOf(item.cantidadArtefacto2));

        String code2 = tier + "_ARTEFACT_" + item.url_artefacto_2;
        setAlbionImage(lblArtefacto2, code2);
    }
}

    private void refreshAll() {
    if (cbxItem.getSelectedItem() == null) return;

    String nombreItem = cbxItem.getSelectedItem().toString();
    ItemData item = DatabaseConnection.obtenerItem(nombreItem);

    if (item == null) return;

    updateItemImage();
    updateMaterials();
    updateArtefactos(item);
}
    
    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        buttonGroup1 = new javax.swing.ButtonGroup();
        jPanel1 = new javax.swing.JPanel();
        jLabel4 = new javax.swing.JLabel();
        jLabel5 = new javax.swing.JLabel();
        jLabel6 = new javax.swing.JLabel();
        cbxEncantamiento = new javax.swing.JComboBox<>();
        jLabel7 = new javax.swing.JLabel();
        jLabel9 = new javax.swing.JLabel();
        cbxItem = new javax.swing.JComboBox<>();
        cbxTier = new javax.swing.JComboBox<>();
        txtBonodeHO = new javax.swing.JTextField();
        jLabel10 = new javax.swing.JLabel();
        cbxCategoria = new javax.swing.JComboBox<>();
        jLabel11 = new javax.swing.JLabel();
        jCheckBox1 = new javax.swing.JCheckBox();
        jCheckBox2 = new javax.swing.JCheckBox();
        jLabel8 = new javax.swing.JLabel();
        txtCantidad = new javax.swing.JTextField();
        jButton1 = new javax.swing.JButton();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        PanelInventario = new javax.swing.JPanel();
        lblNombreItem = new javax.swing.JLabel();
        lblImagenItem = new javax.swing.JLabel();
        lblTipoItem = new javax.swing.JLabel();
        jPanel3 = new javax.swing.JPanel();
        lblMaterial2 = new javax.swing.JLabel();
        lblNombreMaterial2 = new javax.swing.JLabel();
        lblCantidadMaterial2 = new javax.swing.JLabel();
        jPanel4 = new javax.swing.JPanel();
        lblMaterial1 = new javax.swing.JLabel();
        lblNombreMaterial1 = new javax.swing.JLabel();
        lblCantidadMaterial1 = new javax.swing.JLabel();
        jPanel5 = new javax.swing.JPanel();
        lblArtefacto1 = new javax.swing.JLabel();
        lblNombreArtefacto1 = new javax.swing.JLabel();
        lblCantidadArtefacto1 = new javax.swing.JLabel();
        jPanel6 = new javax.swing.JPanel();
        lblArtefacto2 = new javax.swing.JLabel();
        lblNombreArtefacto2 = new javax.swing.JLabel();
        lblCantidadArtefacto2 = new javax.swing.JLabel();
        jPanel2 = new javax.swing.JPanel();

        setBackground(new java.awt.Color(7, 11, 15));
        setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jPanel1.setBackground(new java.awt.Color(2, 6, 24));
        jPanel1.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(29, 17, 56), 2, true));
        jPanel1.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jLabel4.setFont(new java.awt.Font("DejaVu Sans Condensed", 1, 12)); // NOI18N
        jLabel4.setForeground(new java.awt.Color(161, 102, 216));
        jLabel4.setText("INGRESO MANUAL DE MATERIALES");
        jPanel1.add(jLabel4, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 10, 270, 40));

        jLabel5.setForeground(new java.awt.Color(19, 22, 26));
        jLabel5.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel5.setText("_________________________________________   ____");
        jPanel1.add(jLabel5, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 30, 340, -1));

        jLabel6.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        jLabel6.setForeground(new java.awt.Color(92, 104, 126));
        jLabel6.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel6.setText("BONO DE HO");
        jPanel1.add(jLabel6, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 330, 160, 30));

        cbxEncantamiento.setBackground(new java.awt.Color(15, 23, 43));
        cbxEncantamiento.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 15)); // NOI18N
        cbxEncantamiento.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { ".0", ".1", ".2", ".3", ".4" }));
        cbxEncantamiento.addActionListener(this::cbxEncantamientoActionPerformed);
        jPanel1.add(cbxEncantamiento, new org.netbeans.lib.awtextra.AbsoluteConstraints(210, 190, 180, -1));

        jLabel7.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        jLabel7.setForeground(new java.awt.Color(92, 104, 126));
        jLabel7.setText("ITEM:");
        jPanel1.add(jLabel7, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 100, 140, 30));

        jLabel9.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        jLabel9.setForeground(new java.awt.Color(92, 104, 126));
        jLabel9.setText("ENCANTAMIENTO:");
        jPanel1.add(jLabel9, new org.netbeans.lib.awtextra.AbsoluteConstraints(210, 160, 150, 30));

        cbxItem.setBackground(new java.awt.Color(15, 23, 43));
        cbxItem.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 15)); // NOI18N
        cbxItem.addActionListener(this::cbxItemActionPerformed);
        jPanel1.add(cbxItem, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 130, 380, -1));

        cbxTier.setBackground(new java.awt.Color(15, 23, 43));
        cbxTier.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 15)); // NOI18N
        cbxTier.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "T4", "T5", "T6", "T7", "T8" }));
        cbxTier.addActionListener(this::cbxTierActionPerformed);
        jPanel1.add(cbxTier, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 190, 180, -1));

        txtBonodeHO.setBackground(new java.awt.Color(15, 23, 43));
        txtBonodeHO.setHorizontalAlignment(javax.swing.JTextField.RIGHT);
        txtBonodeHO.setText("0");
        txtBonodeHO.addActionListener(this::txtBonodeHOActionPerformed);
        jPanel1.add(txtBonodeHO, new org.netbeans.lib.awtextra.AbsoluteConstraints(150, 340, 240, -1));

        jLabel10.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        jLabel10.setForeground(new java.awt.Color(92, 104, 126));
        jLabel10.setText("CATEGORIA:");
        jPanel1.add(jLabel10, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 50, 140, 30));

        cbxCategoria.setBackground(new java.awt.Color(15, 23, 43));
        cbxCategoria.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 15)); // NOI18N
        cbxCategoria.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Herrero", "Flechero", "Herrero Magico", " " }));
        cbxCategoria.addActionListener(this::cbxCategoriaActionPerformed);
        jPanel1.add(cbxCategoria, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 80, 380, -1));

        jLabel11.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        jLabel11.setForeground(new java.awt.Color(92, 104, 126));
        jLabel11.setText("TIER:");
        jPanel1.add(jLabel11, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 160, 50, 30));

        jCheckBox1.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        jCheckBox1.setForeground(new java.awt.Color(92, 104, 126));
        jCheckBox1.setText("CIUDAD DE CRAFTEO");
        jCheckBox1.addActionListener(this::jCheckBox1ActionPerformed);
        jPanel1.add(jCheckBox1, new org.netbeans.lib.awtextra.AbsoluteConstraints(40, 310, -1, -1));

        jCheckBox2.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        jCheckBox2.setForeground(new java.awt.Color(92, 104, 126));
        jCheckBox2.setText("BONO DE ACTIVIDAD");
        jCheckBox2.addActionListener(this::jCheckBox2ActionPerformed);
        jPanel1.add(jCheckBox2, new org.netbeans.lib.awtextra.AbsoluteConstraints(40, 280, -1, -1));

        jLabel8.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        jLabel8.setForeground(new java.awt.Color(92, 104, 126));
        jLabel8.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel8.setText("CANTIDAD A CRAFTEAR");
        jPanel1.add(jLabel8, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 220, 380, 30));

        txtCantidad.setBackground(new java.awt.Color(15, 23, 43));
        txtCantidad.setHorizontalAlignment(javax.swing.JTextField.RIGHT);
        txtCantidad.setText("0");
        txtCantidad.addActionListener(this::txtCantidadActionPerformed);
        jPanel1.add(txtCantidad, new org.netbeans.lib.awtextra.AbsoluteConstraints(50, 250, 280, -1));

        jButton1.setBackground(new java.awt.Color(152, 16, 250));
        jButton1.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 14)); // NOI18N
        jButton1.setText("+AÑADIR");
        jButton1.setToolTipText("");
        jPanel1.add(jButton1, new org.netbeans.lib.awtextra.AbsoluteConstraints(250, 10, 140, 30));

        add(jPanel1, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 80, 400, 390));

        jLabel1.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 18)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(255, 255, 255));
        jLabel1.setText("Inventario ");
        add(jLabel1, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 10, 390, 30));

        jLabel2.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 10)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(255, 255, 255));
        jLabel2.setText("Revision del stack de Materiales  runas y Artefactos disponibles  (Los consumos por crafteo se deducen automaticamente en tiermpo real)");
        add(jLabel2, new org.netbeans.lib.awtextra.AbsoluteConstraints(40, 30, -1, -1));

        jLabel3.setForeground(new java.awt.Color(19, 22, 26));
        jLabel3.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel3.setText("____________________________________________________________________________________________________________________________________________________________________");
        add(jLabel3, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 40, -1, -1));

        PanelInventario.setBackground(new java.awt.Color(5, 9, 19));
        PanelInventario.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(8, 12, 22), 2, true));
        PanelInventario.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblNombreItem.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        lblNombreItem.setForeground(new java.awt.Color(92, 104, 126));
        lblNombreItem.setText("NOMBRE ITM");
        PanelInventario.add(lblNombreItem, new org.netbeans.lib.awtextra.AbsoluteConstraints(200, 30, 150, 30));

        lblImagenItem.setText("IMG");
        lblImagenItem.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(1, 70, 58), 2, true));
        PanelInventario.add(lblImagenItem, new org.netbeans.lib.awtextra.AbsoluteConstraints(40, 30, 150, 150));

        lblTipoItem.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        lblTipoItem.setForeground(new java.awt.Color(92, 104, 126));
        lblTipoItem.setText("TIPO ITEM");
        PanelInventario.add(lblTipoItem, new org.netbeans.lib.awtextra.AbsoluteConstraints(200, 60, 150, 30));

        jPanel3.setBackground(new java.awt.Color(2, 6, 24));
        jPanel3.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(29, 17, 56), 2, true));
        jPanel3.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblMaterial2.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblMaterial2.setText("IMG");
        lblMaterial2.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(6, 125, 152), 2, true));
        jPanel3.add(lblMaterial2, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 10, 100, 100));

        lblNombreMaterial2.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        lblNombreMaterial2.setForeground(new java.awt.Color(92, 104, 126));
        lblNombreMaterial2.setText("NOMBRE MATERIAL 2");
        jPanel3.add(lblNombreMaterial2, new org.netbeans.lib.awtextra.AbsoluteConstraints(130, 10, 220, 30));

        lblCantidadMaterial2.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        lblCantidadMaterial2.setForeground(new java.awt.Color(92, 104, 126));
        lblCantidadMaterial2.setText("CANTIDAD MATERIAL 2");
        jPanel3.add(lblCantidadMaterial2, new org.netbeans.lib.awtextra.AbsoluteConstraints(130, 40, 220, 30));

        PanelInventario.add(jPanel3, new org.netbeans.lib.awtextra.AbsoluteConstraints(410, 210, 360, 210));

        jPanel4.setBackground(new java.awt.Color(2, 6, 24));
        jPanel4.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(29, 17, 56), 2, true));
        jPanel4.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblMaterial1.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblMaterial1.setText("IMG");
        lblMaterial1.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(6, 125, 152), 2, true));
        jPanel4.add(lblMaterial1, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 10, 100, 100));

        lblNombreMaterial1.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        lblNombreMaterial1.setForeground(new java.awt.Color(92, 104, 126));
        lblNombreMaterial1.setText("NOMBRE MATERIAL 1");
        jPanel4.add(lblNombreMaterial1, new org.netbeans.lib.awtextra.AbsoluteConstraints(130, 10, 220, 30));

        lblCantidadMaterial1.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        lblCantidadMaterial1.setForeground(new java.awt.Color(92, 104, 126));
        lblCantidadMaterial1.setText("CANTIDAD MATERIAL 1");
        jPanel4.add(lblCantidadMaterial1, new org.netbeans.lib.awtextra.AbsoluteConstraints(130, 40, 220, 30));

        PanelInventario.add(jPanel4, new org.netbeans.lib.awtextra.AbsoluteConstraints(30, 210, 360, 210));

        jPanel5.setBackground(new java.awt.Color(2, 6, 24));
        jPanel5.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(29, 17, 56), 2, true));
        jPanel5.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblArtefacto1.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblArtefacto1.setText("IMG");
        lblArtefacto1.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(6, 125, 152), 2, true));
        jPanel5.add(lblArtefacto1, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 10, 100, 100));

        lblNombreArtefacto1.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        lblNombreArtefacto1.setForeground(new java.awt.Color(92, 104, 126));
        lblNombreArtefacto1.setText("NOMBRE ARTEFACTO 1");
        jPanel5.add(lblNombreArtefacto1, new org.netbeans.lib.awtextra.AbsoluteConstraints(130, 10, 220, 30));

        lblCantidadArtefacto1.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        lblCantidadArtefacto1.setForeground(new java.awt.Color(92, 104, 126));
        lblCantidadArtefacto1.setText("CANTIDAD ARTEFACTO 1");
        jPanel5.add(lblCantidadArtefacto1, new org.netbeans.lib.awtextra.AbsoluteConstraints(130, 40, 220, 30));

        PanelInventario.add(jPanel5, new org.netbeans.lib.awtextra.AbsoluteConstraints(30, 440, 360, 210));

        jPanel6.setBackground(new java.awt.Color(2, 6, 24));
        jPanel6.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(29, 17, 56), 2, true));
        jPanel6.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblArtefacto2.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblArtefacto2.setText("IMG");
        lblArtefacto2.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(6, 125, 152), 2, true));
        jPanel6.add(lblArtefacto2, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 10, 100, 100));

        lblNombreArtefacto2.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        lblNombreArtefacto2.setForeground(new java.awt.Color(92, 104, 126));
        lblNombreArtefacto2.setText("NOMBRE ARTEFACTO 2");
        jPanel6.add(lblNombreArtefacto2, new org.netbeans.lib.awtextra.AbsoluteConstraints(130, 10, 220, 30));

        lblCantidadArtefacto2.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        lblCantidadArtefacto2.setForeground(new java.awt.Color(92, 104, 126));
        lblCantidadArtefacto2.setText("CANTIDAD ARTEFACTO 2");
        jPanel6.add(lblCantidadArtefacto2, new org.netbeans.lib.awtextra.AbsoluteConstraints(130, 40, 220, 30));

        PanelInventario.add(jPanel6, new org.netbeans.lib.awtextra.AbsoluteConstraints(410, 440, 360, 210));

        add(PanelInventario, new org.netbeans.lib.awtextra.AbsoluteConstraints(450, 80, 900, 710));

        jPanel2.setBackground(new java.awt.Color(2, 6, 24));
        jPanel2.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(29, 17, 56), 2, true));

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 296, Short.MAX_VALUE)
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 266, Short.MAX_VALUE)
        );

        add(jPanel2, new org.netbeans.lib.awtextra.AbsoluteConstraints(70, 510, 300, 270));
    }// </editor-fold>//GEN-END:initComponents

    private void cbxTierActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cbxTierActionPerformed
refreshAll();    }//GEN-LAST:event_cbxTierActionPerformed

    private void txtBonodeHOActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_txtBonodeHOActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_txtBonodeHOActionPerformed

    private void jCheckBox1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jCheckBox1ActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_jCheckBox1ActionPerformed

    private void jCheckBox2ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jCheckBox2ActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_jCheckBox2ActionPerformed

    private void txtCantidadActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_txtCantidadActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_txtCantidadActionPerformed

    private void cbxCategoriaActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cbxCategoriaActionPerformed

    if (cbxCategoria.getSelectedItem() == null) {
        return;
    }

    String categoria = cbxCategoria.getSelectedItem().toString();

    cbxItem.removeAllItems();

    if (categoria.equals("Herrero")) {

        for (String item : DatabaseConnection.obtenerItemsHerrero()) {
            cbxItem.addItem(item);
        }

    } // TODO add your handling code here:
    }//GEN-LAST:event_cbxCategoriaActionPerformed

    private void cbxItemActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cbxItemActionPerformed
  
       if (cbxItem.getSelectedItem() == null) {
        return;
    }

    String nombreItem = cbxItem.getSelectedItem().toString();

    ItemData item = DatabaseConnection.obtenerItem(nombreItem);

    if (item == null) {
        return;
    }

    String tier = cbxTier.getSelectedItem().toString();

    // LEVEL LOGIC (.0 sin level)
    String enchantText = cbxEncantamiento.getSelectedItem().toString();
    String level = "";
    if (!enchantText.equals(".0")) {
        level = "_LEVEL" + enchantText.replace(".", "");
    }

    // ITEM INFO
    lblNombreItem.setText(item.item);
    lblTipoItem.setText(item.tipoItem);

    // LIMPIAR MATERIALES
    lblNombreMaterial1.setText("");
    lblCantidadMaterial1.setText("");
    lblMaterial1.setIcon(null);

    lblNombreMaterial2.setText("");
    lblCantidadMaterial2.setText("");
    lblMaterial2.setIcon(null);

    int slot = 1;

    // LINGOTES
    if (item.lingotes > 0) {

        if (slot == 1) {
            lblNombreMaterial1.setText("Lingotes");
            lblCantidadMaterial1.setText(String.valueOf(item.lingotes));
            setAlbionImage(lblMaterial1, tier + "_METALBAR" + level);
        } else {
            lblNombreMaterial2.setText("Lingotes");
            lblCantidadMaterial2.setText(String.valueOf(item.lingotes));
            setAlbionImage(lblMaterial2, tier + "_METALBAR" + level);
        }

        slot++;
    }

    // TABLAS
    if (item.tablas > 0) {

        if (slot == 1) {
            lblNombreMaterial1.setText("Tablas");
            lblCantidadMaterial1.setText(String.valueOf(item.tablas));
            setAlbionImage(lblMaterial1, tier + "_PLANKS" + level);
        } else {
            lblNombreMaterial2.setText("Tablas");
            lblCantidadMaterial2.setText(String.valueOf(item.tablas));
            setAlbionImage(lblMaterial2, tier + "_PLANKS" + level);
        }

        slot++;
    }

    // TELAS
    if (item.telas > 0) {

        if (slot == 1) {
            lblNombreMaterial1.setText("Telas");
            lblCantidadMaterial1.setText(String.valueOf(item.telas));
            setAlbionImage(lblMaterial1, tier + "_CLOTH" + level);
        } else {
            lblNombreMaterial2.setText("Telas");
            lblCantidadMaterial2.setText(String.valueOf(item.telas));
            setAlbionImage(lblMaterial2, tier + "_CLOTH" + level);
        }

        slot++;
    }

    // CUEROS
    if (item.cueros > 0) {

        if (slot == 1) {
            lblNombreMaterial1.setText("Cueros");
            lblCantidadMaterial1.setText(String.valueOf(item.cueros));
            setAlbionImage(lblMaterial1, tier + "_LEATHER" + level);
        } else {
            lblNombreMaterial2.setText("Cueros");
            lblCantidadMaterial2.setText(String.valueOf(item.cueros));
            setAlbionImage(lblMaterial2, tier + "_LEATHER" + level);
        }

        slot++;
    }

 // LIMPIAR SIEMPRE
lblNombreArtefacto1.setText("");
lblCantidadArtefacto1.setText("");
lblArtefacto1.setIcon(null);

lblNombreArtefacto2.setText("");
lblCantidadArtefacto2.setText("");
lblArtefacto2.setIcon(null);

// ARTEFACTO 1
if (item.artefacto1 != null && !item.artefacto1.trim().isEmpty()) {

    lblNombreArtefacto1.setText(item.artefacto1);
    lblCantidadArtefacto1.setText(String.valueOf(item.cantidadArtefacto1));

    String code = cbxTier.getSelectedItem().toString() 
                + "_ARTEFACT_" 
                + item.url_artefacto_1;

    setAlbionImage(lblArtefacto1, code);
}

// ARTEFACTO 2
if (item.artefacto2 != null && !item.artefacto2.trim().isEmpty()) {

    lblNombreArtefacto2.setText(item.artefacto2);
    lblCantidadArtefacto2.setText(String.valueOf(item.cantidadArtefacto2));

    String code = cbxTier.getSelectedItem().toString() 
                + "_ARTEFACT_" 
                + item.url_artefacto_2;

    setAlbionImage(lblArtefacto2, code);
}

    // DEBUG
    System.out.println("Artefacto 1: " + item.artefacto1);
    System.out.println("Cantidad 1: " + item.cantidadArtefacto1);
    System.out.println("Artefacto 2: " + item.artefacto2);
    System.out.println("Cantidad 2: " + item.cantidadArtefacto2);
System.out.println("URL ARTEFACTO 1: " + item.url_artefacto_1);
System.out.println("URL ARTEFACTO 2: " + item.url_artefacto_2);

    url_item = item.getUrl_item();
    updateItemImage();
    updateMaterials();

    }//GEN-LAST:event_cbxItemActionPerformed

    private void cbxEncantamientoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cbxEncantamientoActionPerformed
refreshAll();    }//GEN-LAST:event_cbxEncantamientoActionPerformed


    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JPanel PanelInventario;
    private javax.swing.ButtonGroup buttonGroup1;
    private javax.swing.JComboBox<String> cbxCategoria;
    private javax.swing.JComboBox<String> cbxEncantamiento;
    private javax.swing.JComboBox<String> cbxItem;
    private javax.swing.JComboBox<String> cbxTier;
    private javax.swing.JButton jButton1;
    private javax.swing.JCheckBox jCheckBox1;
    private javax.swing.JCheckBox jCheckBox2;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel11;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JPanel jPanel4;
    private javax.swing.JPanel jPanel5;
    private javax.swing.JPanel jPanel6;
    private javax.swing.JLabel lblArtefacto1;
    private javax.swing.JLabel lblArtefacto2;
    private javax.swing.JLabel lblCantidadArtefacto1;
    private javax.swing.JLabel lblCantidadArtefacto2;
    private javax.swing.JLabel lblCantidadMaterial1;
    private javax.swing.JLabel lblCantidadMaterial2;
    private javax.swing.JLabel lblImagenItem;
    private javax.swing.JLabel lblMaterial1;
    private javax.swing.JLabel lblMaterial2;
    private javax.swing.JLabel lblNombreArtefacto1;
    private javax.swing.JLabel lblNombreArtefacto2;
    private javax.swing.JLabel lblNombreItem;
    private javax.swing.JLabel lblNombreMaterial1;
    private javax.swing.JLabel lblNombreMaterial2;
    private javax.swing.JLabel lblTipoItem;
    private javax.swing.JTextField txtBonodeHO;
    private javax.swing.JTextField txtCantidad;
    // End of variables declaration//GEN-END:variables
}
