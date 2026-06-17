package Modelo;

public class Item {
    private String item;
    private String tipoItem;
    private String urlItem;
    
    private int lingotes;
    private int tablas;
    private int telas;
    private int cueros;
    
    private String artefacto1;
    private int cantidadArtefacto1;
    private String urlArtefacto1;
    
    private String artefacto2;
    private int cantidadArtefacto2;
    private String urlArtefacto2;

    public Item(String item, String tipoItem, String urlItem,
                int lingotes, int tablas, int telas, int cueros,
                String artefacto1, int cantidadArtefacto1, String urlArtefacto1,
                String artefacto2, int cantidadArtefacto2, String urlArtefacto2) {
        this.item = item;
        this.tipoItem = tipoItem;
        this.urlItem = urlItem;
        this.lingotes = lingotes;
        this.tablas = tablas;
        this.telas = telas;
        this.cueros = cueros;
        this.artefacto1 = artefacto1;
        this.cantidadArtefacto1 = cantidadArtefacto1;
        this.urlArtefacto1 = urlArtefacto1;
        this.artefacto2 = artefacto2;
        this.cantidadArtefacto2 = cantidadArtefacto2;
        this.urlArtefacto2 = urlArtefacto2;
    }

    public String getItem() { return item; }
    public String getTipoItem() { return tipoItem; }
    public String getUrlItem() { return urlItem; }
    public int getLingotes() { return lingotes; }
    public int getTablas() { return tablas; }
    public int getTelas() { return telas; }
    public int getCueros() { return cueros; }
    public String getArtefacto1() { return artefacto1; }
    public int getCantidadArtefacto1() { return cantidadArtefacto1; }
    public String getUrlArtefacto1() { return urlArtefacto1; }
    public String getArtefacto2() { return artefacto2; }
    public int getCantidadArtefacto2() { return cantidadArtefacto2; }
    public String getUrlArtefacto2() { return urlArtefacto2; }

    @Override
    public String toString() {
        return item;
    }
}