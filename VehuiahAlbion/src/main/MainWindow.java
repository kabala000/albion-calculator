package main;

/**
 *
 * @author vehuiah
 */

import panels.CraftingPanel;

public class MainWindow extends javax.swing.JFrame {
    
    private static final java.util.logging.Logger logger = java.util.logging.Logger.getLogger(MainWindow.class.getName());

    /**
     * Creates new form MainWindow
     */
    public MainWindow() {
        initComponents();
        setSize(1600, 900);

setLocationRelativeTo(null);
        
     CraftingPanel craftingPanel = new CraftingPanel();
     contentPanel.add(
        craftingPanel,
        new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 0, 1360, 900)
);

    }

   
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        contentPanel = new javax.swing.JPanel();
        panelMenu = new javax.swing.JPanel();
        lblLogo = new javax.swing.JLabel();
        btnHome = new javax.swing.JButton();
        btnCrafting = new javax.swing.JButton();
        btnList = new javax.swing.JButton();
        btnConfig = new javax.swing.JButton();
        btnMarket = new javax.swing.JButton();
        btnExit = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setPreferredSize(new java.awt.Dimension(1600, 900));
        setResizable(false);
        getContentPane().setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        contentPanel.setBackground(new java.awt.Color(13, 17, 23));
        contentPanel.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());
        getContentPane().add(contentPanel, new org.netbeans.lib.awtextra.AbsoluteConstraints(240, 0, 1550, 900));

        panelMenu.setBackground(new java.awt.Color(12, 12, 18));
        panelMenu.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 255, 180), 2));
        panelMenu.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblLogo.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblLogo.setText("Logo");
        lblLogo.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 255, 180)));
        panelMenu.add(lblLogo, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 20, 200, 120));

        btnHome.setBackground(new java.awt.Color(22, 22, 30));
        btnHome.setForeground(new java.awt.Color(220, 220, 220));
        btnHome.setText("Inicio");
        btnHome.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 255, 180)));
        panelMenu.add(btnHome, new org.netbeans.lib.awtextra.AbsoluteConstraints(30, 180, 180, 45));

        btnCrafting.setBackground(new java.awt.Color(22, 22, 30));
        btnCrafting.setForeground(new java.awt.Color(220, 220, 220));
        btnCrafting.setText("Crafting");
        btnCrafting.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 255, 180)));
        btnCrafting.addActionListener(this::btnCraftingActionPerformed);
        panelMenu.add(btnCrafting, new org.netbeans.lib.awtextra.AbsoluteConstraints(30, 240, 180, 45));

        btnList.setBackground(new java.awt.Color(22, 22, 30));
        btnList.setForeground(new java.awt.Color(220, 220, 220));
        btnList.setText("Lista");
        btnList.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 255, 180)));
        panelMenu.add(btnList, new org.netbeans.lib.awtextra.AbsoluteConstraints(30, 300, 180, 45));

        btnConfig.setBackground(new java.awt.Color(22, 22, 30));
        btnConfig.setForeground(new java.awt.Color(220, 220, 220));
        btnConfig.setText("Config");
        btnConfig.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 255, 180)));
        panelMenu.add(btnConfig, new org.netbeans.lib.awtextra.AbsoluteConstraints(30, 360, 180, 45));

        btnMarket.setBackground(new java.awt.Color(22, 22, 30));
        btnMarket.setForeground(new java.awt.Color(220, 220, 220));
        btnMarket.setText("Market");
        btnMarket.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 255, 180)));
        panelMenu.add(btnMarket, new org.netbeans.lib.awtextra.AbsoluteConstraints(30, 420, 180, 45));

        btnExit.setBackground(new java.awt.Color(22, 22, 30));
        btnExit.setForeground(new java.awt.Color(220, 220, 220));
        btnExit.setText("Exit");
        btnExit.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 255, 180)));
        panelMenu.add(btnExit, new org.netbeans.lib.awtextra.AbsoluteConstraints(30, 780, 180, 45));

        getContentPane().add(panelMenu, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 0, 240, 900));

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void btnCraftingActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnCraftingActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_btnCraftingActionPerformed

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ReflectiveOperationException | javax.swing.UnsupportedLookAndFeelException ex) {
            logger.log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(() -> new MainWindow().setVisible(true));
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btnConfig;
    private javax.swing.JButton btnCrafting;
    private javax.swing.JButton btnExit;
    private javax.swing.JButton btnHome;
    private javax.swing.JButton btnList;
    private javax.swing.JButton btnMarket;
    private javax.swing.JPanel contentPanel;
    private javax.swing.JLabel lblLogo;
    private javax.swing.JPanel panelMenu;
    // End of variables declaration//GEN-END:variables
}
