/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ItemRecipe, GlobalPricesState, ItemTier, EnchantmentLevel, AlbionCity, MaterialPriceRecord } from './types';

// Full parsed recipe database from the user instructions
export const ITEM_RECIPES: ItemRecipe[] = [
  // --- HERRERO / ARMADURAS DE PLACA ---
  {
    Item: "Botas de Soldados", Artesano: "Herrero", TipoItem: "Botas", Categoria: "Botas de Placa",
    Lingotes: 8, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_SHOES_PLATE_SET1", Url_Artefacto1: "N/A"
  },
  {
    Item: "Botas de Caballero", Artesano: "Herrero", TipoItem: "Botas", Categoria: "Botas de Placa",
    Lingotes: 8, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_SHOES_PLATE_SET2", Url_Artefacto1: "N/A"
  },
  {
    Item: "Botas de Guardian", Artesano: "Herrero", TipoItem: "Botas", Categoria: "Botas de Placa",
    Lingotes: 8, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_SHOES_PLATE_SET3", Url_Artefacto1: "N/A"
  },
  {
    Item: "Botas de Guardatumbas", Artesano: "Herrero", TipoItem: "Botas", Categoria: "Botas de Placa",
    Lingotes: 8, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "Atadura antigua", CantidadArtefacto1: 1,
    Url_Item: "T4_SHOES_PLATE_UNDEAD", Url_Artefacto1: "SHOES_PLATE_UNDEAD"
  },
  {
    Item: "Botas de Demonio", Artesano: "Herrero", TipoItem: "Botas", Categoria: "Botas de Placa",
    Lingotes: 8, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "Relleno demoniaco", CantidadArtefacto1: 1,
    Url_Item: "T4_SHOES_PLATE_HELL", Url_Artefacto1: "SHOES_PLATE_HELL"
  },
  {
    Item: "Botas de Juez", Artesano: "Herrero", TipoItem: "Botas", Categoria: "Botas de Placa",
    Lingotes: 8, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "Atadura Inscrita", CantidadArtefacto1: 1,
    Url_Item: "T4_SHOES_PLATE_KEEPER", Url_Artefacto1: "SHOES_PLATE_KEEPER"
  },
  {
    Item: "Botas Crepusculares", Artesano: "Herrero", TipoItem: "Botas", Categoria: "Botas de Placa",
    Lingotes: 8, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "Garra de TejeVelos", CantidadArtefacto1: 1,
    Url_Item: "T4_SHOES_PLATE_FEY", Url_Artefacto1: "SHOES_PLATE_FEY"
  },
  {
    Item: "Botas de Valor", Artesano: "Herrero", TipoItem: "Botas", Categoria: "Botas de Placa",
    Lingotes: 8, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "Greba Exaltada", CantidadArtefacto1: 1,
    Url_Item: "T4_SHOES_PLATE_AVALON", Url_Artefacto1: "SHOES_PLATE_AVALON"
  },
  {
    Item: "Armaduras de Soldados", Artesano: "Herrero", TipoItem: "Armaduras", Categoria: "Armaduras de Placa",
    Lingotes: 16, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_ARMOR_PLATE_SET1", Url_Artefacto1: "N/A"
  },
  {
    Item: "Armaduras de Caballero", Artesano: "Herrero", TipoItem: "Armaduras", Categoria: "Armaduras de Placa",
    Lingotes: 16, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_ARMOR_PLATE_SET2", Url_Artefacto1: "N/A"
  },
  {
    Item: "Armaduras de Guardian", Artesano: "Herrero", TipoItem: "Armaduras", Categoria: "Armaduras de Placa",
    Lingotes: 16, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_ARMOR_PLATE_SET3", Url_Artefacto1: "N/A"
  },
  {
    Item: "Armaduras de Guardatumbas", Artesano: "Herrero", TipoItem: "Armaduras", Categoria: "Armaduras de Placa",
    Lingotes: 16, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "Cota de Malla Antigua", CantidadArtefacto1: 1,
    Url_Item: "T4_ARMOR_PLATE_UNDEAD", Url_Artefacto1: "ARMOR_PLATE_UNDEAD"
  },
  {
    Item: "Armaduras de Demonio", Artesano: "Herrero", TipoItem: "Armaduras", Categoria: "Armaduras de Placa",
    Lingotes: 16, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "Placas Demoniacas", CantidadArtefacto1: 1,
    Url_Item: "T4_ARMOR_PLATE_HELL", Url_Artefacto1: "ARMOR_PLATE_HELL"
  },
  {
    Item: "Armaduras de Juez", Artesano: "Herrero", TipoItem: "Armaduras", Categoria: "Armaduras de Placa",
    Lingotes: 16, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "Pieles de Animal Precervadas", CantidadArtefacto1: 1,
    Url_Item: "T4_ARMOR_PLATE_KEEPER", Url_Artefacto1: "ARMOR_PLATE_KEEPER"
  },
  {
    Item: "Armaduras Crepuscular", Artesano: "Herrero", TipoItem: "Armaduras", Categoria: "Armaduras de Placa",
    Lingotes: 16, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "Caparazon de TejeVelos", CantidadArtefacto1: 1,
    Url_Item: "T4_ARMOR_PLATE_FEY", Url_Artefacto1: "ARMOR_PLATE_FEY"
  },
  {
    Item: "Armaduras de Valor", Artesano: "Herrero", TipoItem: "Armaduras", Categoria: "Armaduras de Placa",
    Lingotes: 16, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "Enchapado Exaltado", CantidadArtefacto1: 1,
    Url_Item: "T4_ARMOR_PLATE_AVALON", Url_Artefacto1: "ARMOR_PLATE_AVALON"
  },
  {
    Item: "Casco de Soldados", Artesano: "Herrero", TipoItem: "Cascos", Categoria: "Casco de Placa",
    Lingotes: 8, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_HEAD_PLATE_SET1", Url_Artefacto1: "N/A"
  },
  {
    Item: "Casco de Caballero", Artesano: "Herrero", TipoItem: "Cascos", Categoria: "Casco de Placa",
    Lingotes: 8, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_HEAD_PLATE_SET2", Url_Artefacto1: "N/A"
  },
  {
    Item: "Casco de Guardian", Artesano: "Herrero", TipoItem: "Cascos", Categoria: "Casco de Placa",
    Lingotes: 8, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_HEAD_PLATE_SET3", Url_Artefacto1: "N/A"
  },
  {
    Item: "Casco de Guardatumbas", Artesano: "Herrero", TipoItem: "Cascos", Categoria: "Casco de Placa",
    Lingotes: 8, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "Acolchado Antiguo", CantidadArtefacto1: 1,
    Url_Item: "T4_HEAD_PLATE_UNDEAD", Url_Artefacto1: "HEAD_PLATE_UNDEAD"
  },
  {
    Item: "Casco de Demonio", Artesano: "Herrero", TipoItem: "Cascos", Categoria: "Casco de Placa",
    Lingotes: 8, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "Esquirlas Demoniacas", CantidadArtefacto1: 1,
    Url_Item: "T4_HEAD_PLATE_HELL", Url_Artefacto1: "HEAD_PLATE_HELL"
  },
  {
    Item: "Casco de Juez", Artesano: "Herrero", TipoItem: "Cascos", Categoria: "Casco de Placa",
    Lingotes: 8, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "Acolchado de Calavera Tallada", CantidadArtefacto1: 1,
    Url_Item: "T4_HEAD_PLATE_KEEPER", Url_Artefacto1: "HEAD_PLATE_KEEPER"
  },
  {
    Item: "Casco Crepusculares", Artesano: "Herrero", TipoItem: "Cascos", Categoria: "Casco de Placa",
    Lingotes: 8, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "Mandibulas de TejeVelos", CantidadArtefacto1: 1,
    Url_Item: "T4_HEAD_PLATE_FEY", Url_Artefacto1: "HEAD_PLATE_FEY"
  },
  {
    Item: "Casco de Valor", Artesano: "Herrero", TipoItem: "Cascos", Categoria: "Casco de Placa",
    Lingotes: 8, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "Viceras Exaltada", CantidadArtefacto1: 1,
    Url_Item: "T4_HEAD_PLATE_AVALON", Url_Artefacto1: "HEAD_PLATE_AVALON"
  },

  // --- ESPADAS ---
  {
    Item: "Espada Ancha", Artesano: "Herrero", TipoItem: "Arma de una Mano", Categoria: "Espadas",
    Lingotes: 16, Tablas: 0, Telas: 0, Cueros: 8, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_MAIN_SWORD", Url_Artefacto1: "N/A"
  },
  {
    Item: "Claymore", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Espadas",
    Lingotes: 20, Tablas: 0, Telas: 0, Cueros: 12, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_CLAYMORE", Url_Artefacto1: "N/A"
  },
  {
    Item: "Dos Espadas", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Espadas",
    Lingotes: 20, Tablas: 0, Telas: 0, Cueros: 12, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_DUALSWORD", Url_Artefacto1: "N/A"
  },
  {
    Item: "Hoja Clarent", Artesano: "Herrero", TipoItem: "Arma de una Mano", Categoria: "Espadas",
    Lingotes: 16, Tablas: 0, Telas: 0, Cueros: 8, Artefacto1: "Hoja Forjada con Sangre", CantidadArtefacto1: 1,
    Url_Item: "T4_MAIN_SCIMITAR_MORGANA", Url_Artefacto1: "MAIN_SCIMITAR_MORGANA"
  },
  {
    Item: "Espada Tallada", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Espadas",
    Lingotes: 20, Tablas: 0, Telas: 0, Cueros: 12, Artefacto1: "Hoja Demoniaca", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_CLEAVER_HELL", Url_Artefacto1: "2H_CLEAVER_HELL"
  },
  {
    Item: "Dos Galatinas", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Espadas",
    Lingotes: 20, Tablas: 0, Telas: 0, Cueros: 12, Artefacto1: "Hojas Malditas", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_DUALSCIMITAR_UNDEAD", Url_Artefacto1: "2H_DUALSCIMITAR_UNDEAD"
  },
  {
    Item: "Crea-Reyes", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Espadas",
    Lingotes: 20, Tablas: 0, Telas: 0, Cueros: 12, Artefacto1: "Restos del Rey Viejo", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_CLAYMORE_AVALON", Url_Artefacto1: "2H_CLAYMORE_AVALON"
  },
  {
    Item: "Hoja Infinita", Artesano: "Herrero", TipoItem: "Arma de una Mano", Categoria: "Espadas",
    Lingotes: 16, Tablas: 0, Telas: 0, Cueros: 8, Artefacto1: "Cristal Infinito", CantidadArtefacto1: 1,
    Url_Item: "T4_MAIN_SWORD_CRYSTAL", Url_Artefacto1: "MAIN_SWORD_CRYSTAL"
  },

  // --- HACHAS ---
  {
    Item: "Hacha de Guerra", Artesano: "Herrero", TipoItem: "Arma de una Mano", Categoria: "Hachas",
    Lingotes: 16, Tablas: 8, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_MAIN_AXE", Url_Artefacto1: "N/A"
  },
  {
    Item: "Gran Hacha", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Hachas",
    Lingotes: 20, Tablas: 12, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_AXE", Url_Artefacto1: "N/A"
  },
  {
    Item: "Alabarda", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Hachas",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_HALBERD", Url_Artefacto1: "N/A"
  },
  {
    Item: "LlamaCarroña", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Hachas",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "Cabeza de Alabarda de Morgana", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_HALBERD_MORGANA", Url_Artefacto1: "2H_HALBERD_MORGANA"
  },
  {
    Item: "Guadaña Infernal", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Hachas",
    Lingotes: 20, Tablas: 12, Telas: 0, Cueros: 0, Artefacto1: "Cabeza de Hoz Demoniaca", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_SCYTHE_HELL", Url_Artefacto1: "2H_SCYTHE_HELL"
  },
  {
    Item: "Patas de Oso", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Hachas",
    Lingotes: 20, Tablas: 12, Telas: 0, Cueros: 0, Artefacto1: "Cabeza de Hachas de Guardian", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_DUALAXE_KEEPER", Url_Artefacto1: "2H_DUALAXE_KEEPER"
  },
  {
    Item: "RompeReinos", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Hachas",
    Lingotes: 20, Tablas: 12, Telas: 0, Cueros: 0, Artefacto1: "Recuerdos de Batallas Avaloniana", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_AXE_AVALON", Url_Artefacto1: "2H_AXE_AVALON"
  },
  {
    Item: "False de Cristal", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Hachas",
    Lingotes: 20, Tablas: 12, Telas: 0, Cueros: 0, Artefacto1: "Crital Afilado", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_SCYTHE_CRYSTAL", Url_Artefacto1: "2H_SCYTHE_CRYSTAL"
  },

  // --- MAZAS ---
  {
    Item: "Maza", Artesano: "Herrero", TipoItem: "Arma de una Mano", Categoria: "Mazas",
    Lingotes: 16, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_MAIN_MACE", Url_Artefacto1: "N/A"
  },
  {
    Item: "Maza Pesada", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Mazas",
    Lingotes: 20, Tablas: 0, Telas: 12, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_MACE", Url_Artefacto1: "N/A"
  },
  {
    Item: "Mangual", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Mazas",
    Lingotes: 20, Tablas: 0, Telas: 12, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_FLAIL", Url_Artefacto1: "N/A"
  },
  {
    Item: "Maza de Lecho", Artesano: "Herrero", TipoItem: "Arma de una Mano", Categoria: "Mazas",
    Lingotes: 16, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "Roca Runica", CantidadArtefacto1: 1,
    Url_Item: "T4_MAIN_ROCKMACE_KEEPER", Url_Artefacto1: "MAIN_ROCKMACE_KEEPER"
  },
  {
    Item: "Maza Incubo", Artesano: "Herrero", TipoItem: "Arma de una Mano", Categoria: "Mazas",
    Lingotes: 16, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "Cabeza de Maza Infernal", CantidadArtefacto1: 1,
    Url_Item: "T4_MAIN_MACE_HELL", Url_Artefacto1: "MAIN_MACE_HELL"
  },
  {
    Item: "Maza Camlann", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Mazas",
    Lingotes: 20, Tablas: 0, Telas: 12, Cueros: 0, Artefacto1: "Cabeza de Maza Imbuida", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_MACE_MORGANA", Url_Artefacto1: "2H_MACE_MORGANA"
  },
  {
    Item: "Juradores", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Mazas",
    Lingotes: 20, Tablas: 0, Telas: 12, Cueros: 0, Artefacto1: "Juramentos Rotos", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_DUALMACE_AVALON", Url_Artefacto1: "2H_DUALMACE_AVALON"
  },
  {
    Item: "Monarca de la Tormenta", Artesano: "Herrero", TipoItem: "Arma de una Mano", Categoria: "Mazas",
    Lingotes: 16, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "Cristal de la Tormenta", CantidadArtefacto1: 1,
    Url_Item: "T4_MAIN_MACE_CRYSTAL", Url_Artefacto1: "MAIN_MACE_CRYSTAL"
  },

  // --- MARTILLOS ---
  {
    Item: "Martillo", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Martillos",
    Lingotes: 24, Tablas: 0, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_MAIN_HAMMER", Url_Artefacto1: "N/A"
  },
  {
    Item: "Martillo Largo", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Martillos",
    Lingotes: 20, Tablas: 0, Telas: 0, Cueros: 12, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_POLEHAMMER", Url_Artefacto1: "N/A"
  },
  {
    Item: "Gran Martillo", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Martillos",
    Lingotes: 20, Tablas: 0, Telas: 0, Cueros: 12, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_HAMMER", Url_Artefacto1: "N/A"
  },
  {
    Item: "Martillo de la Tumba", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Martillos",
    Lingotes: 20, Tablas: 0, Telas: 0, Cueros: 12, Artefacto1: "Cabeza de Martillo Antigua", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_HAMMER_UNDEAD", Url_Artefacto1: "2H_HAMMER_UNDEAD"
  },
  {
    Item: "Martillo de Forja", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Martillos",
    Lingotes: 20, Tablas: 0, Telas: 0, Cueros: 12, Artefacto1: "Cabezas de Martillo Diabolicas", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_DUALHAMMER_HELL", Url_Artefacto1: "2H_DUALHAMMER_HELL"
  },
  {
    Item: "GuardaBosques", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Martillos",
    Lingotes: 20, Tablas: 0, Telas: 0, Cueros: 12, Artefacto1: "Tronco Grabado", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_RAM_KEEPER", Url_Artefacto1: "2H_RAM_KEEPER"
  },
  {
    Item: "Mano de Justicia", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Martillos",
    Lingotes: 20, Tablas: 0, Telas: 0, Cueros: 12, Artefacto1: "Mano Metalica Masiva", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_HAMMER_AVALON", Url_Artefacto1: "2H_HAMMER_AVALON"
  },
  {
    Item: "Martillo Relampago", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Martillos",
    Lingotes: 20, Tablas: 0, Telas: 0, Cueros: 12, Artefacto1: "Cristal Crepitante", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_HAMMER_CRYSTAL", Url_Artefacto1: "2H_HAMMER_CRYSTAL"
  },

  // --- GUANTES ---
  {
    Item: "Guantes de Peleador", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Guantes",
    Lingotes: 12, Tablas: 0, Telas: 0, Cueros: 20, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_KNUCKLES_SET1", Url_Artefacto1: "N/A"
  },
  {
    Item: "Brazales de Batalla", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Guantes",
    Lingotes: 12, Tablas: 0, Telas: 0, Cueros: 20, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_KNUCKLES_SET2", Url_Artefacto1: "N/A"
  },
  {
    Item: "Guantaletes de Puas", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Guantes",
    Lingotes: 12, Tablas: 0, Telas: 0, Cueros: 20, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_KNUCKLES_SET3", Url_Artefacto1: "N/A"
  },
  {
    Item: "Zarpas Ozunas", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Guantes",
    Lingotes: 12, Tablas: 0, Telas: 0, Cueros: 20, Artefacto1: "Restos de Guardian", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_KNUCKLES_KEEPER", Url_Artefacto1: "2H_KNUCKLES_KEEPER"
  },
  {
    Item: "Manos Infernales", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Guantes",
    Lingotes: 12, Tablas: 0, Telas: 0, Cueros: 20, Artefacto1: "Cuernos Demoniacos Rotos", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_KNUCKLES_HELL", Url_Artefacto1: "2H_KNUCKLES_HELL"
  },
  {
    Item: "Cestus Corvico", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Guantes",
    Lingotes: 12, Tablas: 0, Telas: 0, Cueros: 20, Artefacto1: "Placa de Cuervo Deforme", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_KNUCKLES_MORGANA", Url_Artefacto1: "2H_KNUCKLES_MORGANA"
  },
  {
    Item: "Puños de Avalon", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Guantes",
    Lingotes: 12, Tablas: 0, Telas: 0, Cueros: 20, Artefacto1: "Guantaletes Avalonianos Dañados", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_KNUCKLES_AVALON", Url_Artefacto1: "2H_KNUCKLES_AVALON"
  },
  {
    Item: "Brazales de Fuerza Pulsantes", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Guantes",
    Lingotes: 12, Tablas: 0, Telas: 0, Cueros: 20, Artefacto1: "Cristal Pulsantes", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_KNUCKLES_CRYSTAL", Url_Artefacto1: "2H_KNUCKLES_CRYSTAL"
  },

  // --- BALLESTAS ---
  {
    Item: "Ballesta", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Ballestas",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_CROSSBOW", Url_Artefacto1: "N/A"
  },
  {
    Item: "Ballesta Pesada", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Ballestas",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_CROSSBOWLARGE", Url_Artefacto1: "N/A"
  },
  {
    Item: "Ballesta Ligera", Artesano: "Herrero", TipoItem: "Arma de una Mano", Categoria: "Ballestas",
    Lingotes: 8, Tablas: 16, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_MAIN_1HCROSSBOW", Url_Artefacto1: "N/A"
  },
  {
    Item: "Repetidora de Consuelo", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Ballestas",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "Mecanismo Perdido de Ballesta", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_REPEATINGCROSSBOW_UNDEAD", Url_Artefacto1: "2H_REPEATINGCROSSBOW_UNDEAD"
  },
  {
    Item: "Lanzasaetas", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Ballestas",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "Saetas Diabolicas", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_DUALCROSSBOW_HELL", Url_Artefacto1: "2H_DUALCROSSBOW_HELL"
  },
  {
    Item: "Arco de Asedio", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Ballestas",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "Saetas Tentadoras", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_CROSSBOWLARGE_MORGANA", Url_Artefacto1: "2H_CROSSBOWLARGE_MORGANA"
  },
  {
    Item: "Modelador de Energia", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Ballestas",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "Veleta de Zumbido Avaloniano", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_CROSSBOW_CANNON_AVALON", Url_Artefacto1: "2H_CROSSBOW_CANNON_AVALON"
  },
  {
    Item: "Desintegradoras de Luz", Artesano: "Herrero", TipoItem: "Arma de dos Manos", Categoria: "Ballestas",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "Cristal de Luz", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_DUALCROSSBOW_CRYSTAL", Url_Artefacto1: "2H_DUALCROSSBOW_CRYSTAL"
  },

  // --- ESCUDOS ---
  {
    Item: "Escudo", Artesano: "Herrero", TipoItem: "Segunda Mano", Categoria: "Escudos",
    Lingotes: 4, Tablas: 4, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_OFF_SHIELD", Url_Artefacto1: "N/A"
  },
  {
    Item: "Sarcofago", Artesano: "Herrero", TipoItem: "Segunda Mano", Categoria: "Escudos",
    Lingotes: 4, Tablas: 4, Telas: 0, Cueros: 0, Artefacto1: "Nucleo de Escudo Antiguo", CantidadArtefacto1: 1,
    Url_Item: "T4_OFF_TOWERSHIELD_UNDEAD", Url_Artefacto1: "OFF_TOWERSHIELD_UNDEAD"
  },
  {
    Item: "Escudo de Villano", Artesano: "Herrero", TipoItem: "Segunda Mano", Categoria: "Escudos",
    Lingotes: 4, Tablas: 4, Telas: 0, Cueros: 0, Artefacto1: "Nucleo de Escudo Infernal", CantidadArtefacto1: 1,
    Url_Item: "T4_OFF_SHIELD_HELL", Url_Artefacto1: "OFF_SHIELD_HELL"
  },
  {
    Item: "Partecaras", Artesano: "Herrero", TipoItem: "Segunda Mano", Categoria: "Escudos",
    Lingotes: 4, Tablas: 4, Telas: 0, Cueros: 0, Artefacto1: "Puas Forjadas con Sangre", CantidadArtefacto1: 1,
    Url_Item: "T4_OFF_SPIKEDSHIELD_MORGANA", Url_Artefacto1: "OFF_SPIKEDSHIELD_MORGANA"
  },
  {
    Item: "Aegis Astral", Artesano: "Herrero", TipoItem: "Segunda Mano", Categoria: "Escudos",
    Lingotes: 4, Tablas: 4, Telas: 0, Cueros: 0, Artefacto1: "Reliquia Avaloniana Destruida", CantidadArtefacto1: 1,
    Url_Item: "T4_OFF_SHIELD_AVALON", Url_Artefacto1: "OFF_SHIELD_AVALON"
  },
  {
    Item: "Barrera Inquebrantable", Artesano: "Herrero", TipoItem: "Segunda Mano", Categoria: "Escudos",
    Lingotes: 4, Tablas: 4, Telas: 0, Cueros: 0, Artefacto1: "Cristal Inquebrantable", CantidadArtefacto1: 1,
    Url_Item: "T4_OFF_SHIELD_CRYSTAL", Url_Artefacto1: "OFF_SHIELD_CRYSTAL"
  },
  
  // --- HERRERO MÁGICO ---
  // Sandalias de telas
  {
    Item: "Sandalia de Erudito", Artesano: "Herrero Mágico", TipoItem: "Botas", Categoria: "Sandalias de Telas",
    Lingotes: 0, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_SHOES_CLOTH_SET1", Url_Artefacto1: "N/A"
  },
  {
    Item: "Sandalia de Clerigo", Artesano: "Herrero Mágico", TipoItem: "Botas", Categoria: "Sandalias de Telas",
    Lingotes: 0, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_SHOES_CLOTH_SET2", Url_Artefacto1: "N/A"
  },
  {
    Item: "Sandalia de Mago", Artesano: "Herrero Mágico", TipoItem: "Botas", Categoria: "Sandalias de Telas",
    Lingotes: 0, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_SHOES_CLOTH_SET3", Url_Artefacto1: "N/A"
  },
  {
    Item: "Sandalia de Druida", Artesano: "Herrero Mágico", TipoItem: "Botas", Categoria: "Sandalias de Telas",
    Lingotes: 0, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "Ataduras Druidas", CantidadArtefacto1: 1,
    Url_Item: "T4_SHOES_CLOTH_KEEPER", Url_Artefacto1: "SHOES_CLOTH_KEEPER"
  },
  {
    Item: "Sandalia de Diablo", Artesano: "Herrero Mágico", TipoItem: "Botas", Categoria: "Sandalias de Telas",
    Lingotes: 0, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "Ataduras de Tela Infernal", CantidadArtefacto1: 1,
    Url_Item: "T4_SHOES_CLOTH_HELL", Url_Artefacto1: "SHOES_CLOTH_HELL"
  },
  {
    Item: "Sandalia de Sectario", Artesano: "Herrero Mágico", TipoItem: "Botas", Categoria: "Sandalias de Telas",
    Lingotes: 0, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "Ataduras Tentadoras", CantidadArtefacto1: 1,
    Url_Item: "T4_SHOES_CLOTH_MORGANA", Url_Artefacto1: "SHOES_CLOTH_MORGANA"
  },
  {
    Item: "Sandalia de Escamas Ferricas", Artesano: "Herrero Mágico", TipoItem: "Botas", Categoria: "Sandalias de Telas",
    Lingotes: 0, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "Escamas de Dragon Feerricas", CantidadArtefacto1: 1,
    Url_Item: "T4_SHOES_CLOTH_FEY", Url_Artefacto1: "SHOES_CLOTH_FEY"
  },
  {
    Item: "Sandalia de Pureza", Artesano: "Herrero Mágico", TipoItem: "Botas", Categoria: "Sandalias de Telas",
    Lingotes: 0, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "Ataduras Santificadoras", CantidadArtefacto1: 1,
    Url_Item: "T4_SHOES_CLOTH_AVALON", Url_Artefacto1: "SHOES_CLOTH_AVALON"
  },

  // Tunicas de telas
  {
    Item: "Tunica de Erudito", Artesano: "Herrero Mágico", TipoItem: "Armaduras", Categoria: "Tunicas de Telas",
    Lingotes: 0, Tablas: 0, Telas: 16, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_ARMOR_CLOTH_SET1", Url_Artefacto1: "N/A"
  },
  {
    Item: "Tunica de Clerigo", Artesano: "Herrero Mágico", TipoItem: "Armaduras", Categoria: "Tunicas de Telas",
    Lingotes: 0, Tablas: 0, Telas: 16, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_ARMOR_CLOTH_SET2", Url_Artefacto1: "N/A"
  },
  {
    Item: "Tunica de Mago", Artesano: "Herrero Mágico", TipoItem: "Armaduras", Categoria: "Tunicas de Telas",
    Lingotes: 0, Tablas: 0, Telas: 16, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_ARMOR_CLOTH_SET3", Url_Artefacto1: "N/A"
  },
  {
    Item: "Tunica de Druida", Artesano: "Herrero Mágico", TipoItem: "Armaduras", Categoria: "Tunicas de Telas",
    Lingotes: 0, Tablas: 0, Telas: 16, Cueros: 0, Artefacto1: "Plumas Druidas", CantidadArtefacto1: 1,
    Url_Item: "T4_ARMOR_CLOTH_KEEPER", Url_Artefacto1: "ARMOR_CLOTH_KEEPER"
  },
  {
    Item: "Tunica de Diablo", Artesano: "Herrero Mágico", TipoItem: "Armaduras", Categoria: "Tunicas de Telas",
    Lingotes: 0, Tablas: 0, Telas: 16, Cueros: 0, Artefacto1: "Pliegues de Tela Infernal", CantidadArtefacto1: 1,
    Url_Item: "T4_ARMOR_CLOTH_HELL", Url_Artefacto1: "ARMOR_CLOTH_HELL"
  },
  {
    Item: "Tunica de Sectario", Artesano: "Herrero Mágico", TipoItem: "Armaduras", Categoria: "Tunicas de Telas",
    Lingotes: 0, Tablas: 0, Telas: 16, Cueros: 0, Artefacto1: "Amuleto Tentador", CantidadArtefacto1: 1,
    Url_Item: "T4_ARMOR_CLOTH_MORGANA", Url_Artefacto1: "ARMOR_CLOTH_MORGANA"
  },
  {
    Item: "Tunica de Escamas Ferricas", Artesano: "Herrero Mágico", TipoItem: "Armaduras", Categoria: "Tunicas de Telas",
    Lingotes: 0, Tablas: 0, Telas: 16, Cueros: 0, Artefacto1: "Ala Dorsal Feericas", CantidadArtefacto1: 1,
    Url_Item: "T4_ARMOR_CLOTH_FEY", Url_Artefacto1: "ARMOR_CLOTH_FEY"
  },
  {
    Item: "Tunica de Pureza", Artesano: "Herrero Mágico", TipoItem: "Armaduras", Categoria: "Tunicas de Telas",
    Lingotes: 0, Tablas: 0, Telas: 16, Cueros: 0, Artefacto1: "Cinturon Santificador", CantidadArtefacto1: 1,
    Url_Item: "T4_ARMOR_CLOTH_AVALON", Url_Artefacto1: "ARMOR_CLOTH_AVALON"
  },

  // Habitos de telas
  {
    Item: "Habito de Erudito", Artesano: "Herrero Mágico", TipoItem: "Cascos", Categoria: "Habitos de Telas",
    Lingotes: 0, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_HEAD_CLOTH_SET1", Url_Artefacto1: "N/A"
  },
  {
    Item: "Habito de Clerigo", Artesano: "Herrero Mágico", TipoItem: "Cascos", Categoria: "Habitos de Telas",
    Lingotes: 0, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_HEAD_CLOTH_SET2", Url_Artefacto1: "N/A"
  },
  {
    Item: "Habito de Mago", Artesano: "Herrero Mágico", TipoItem: "Cascos", Categoria: "Habitos de Telas",
    Lingotes: 0, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_HEAD_CLOTH_SET3", Url_Artefacto1: "N/A"
  },
  {
    Item: "Habito de Druida", Artesano: "Herrero Mágico", TipoItem: "Cascos", Categoria: "Habitos de Telas",
    Lingotes: 0, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "Pico Preservado Druida", CantidadArtefacto1: 1,
    Url_Item: "T4_HEAD_CLOTH_KEEPER", Url_Artefacto1: "HEAD_CLOTH_KEEPER"
  },
  {
    Item: "Habito de Diablo", Artesano: "Herrero Mágico", TipoItem: "Cascos", Categoria: "Habitos de Telas",
    Lingotes: 0, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "Vicera de Tela Infernal", CantidadArtefacto1: 1,
    Url_Item: "T4_HEAD_CLOTH_HELL", Url_Artefacto1: "HEAD_CLOTH_HELL"
  },
  {
    Item: "Habito de Sectario", Artesano: "Herrero Mágico", TipoItem: "Cascos", Categoria: "Habitos de Telas",
    Lingotes: 0, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "Acolchado Tentador", CantidadArtefacto1: 1,
    Url_Item: "T4_HEAD_CLOTH_MORGANA", Url_Artefacto1: "HEAD_CLOTH_MORGANA"
  },
  {
    Item: "Habito de Escamas Ferricas", Artesano: "Herrero Mágico", TipoItem: "Cascos", Categoria: "Habitos de Telas",
    Lingotes: 0, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "Fibula Feerica Intacta", CantidadArtefacto1: 1,
    Url_Item: "T4_HEAD_CLOTH_FEY", Url_Artefacto1: "HEAD_CLOTH_FEY"
  },
  {
    Item: "Habito de Pureza", Artesano: "Herrero Mágico", TipoItem: "Cascos", Categoria: "Habitos de Telas",
    Lingotes: 0, Tablas: 0, Telas: 8, Cueros: 0, Artefacto1: "Mascara Santificadora", CantidadArtefacto1: 1,
    Url_Item: "T4_HEAD_CLOTH_AVALON", Url_Artefacto1: "HEAD_CLOTH_AVALON"
  },

  // Bastones igneos
  {
    Item: "Baston Igneo", Artesano: "Herrero Mágico", TipoItem: "Arma de una Mano", Categoria: "Bastones Igneos",
    Lingotes: 8, Tablas: 16, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_MAIN_FIRESTAFF", Url_Artefacto1: "N/A"
  },
  {
    Item: "Gran Baston Igneo", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Igneos",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_FIRESTAFF", Url_Artefacto1: "N/A"
  },
  {
    Item: "Baston Infernal", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Igneos",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_INFERNOSTAFF", Url_Artefacto1: "N/A"
  },
  {
    Item: "Baston de Fuego Incontrolable", Artesano: "Herrero Mágico", TipoItem: "Arma de una Mano", Categoria: "Bastones Igneos",
    Lingotes: 8, Tablas: 16, Telas: 0, Cueros: 0, Artefacto1: "Orbe de Fuego Incontrolable", CantidadArtefacto1: 1,
    Url_Item: "T4_MAIN_FIRESTAFF_KEEPER", Url_Artefacto1: "MAIN_FIRESTAFF_KEEPER"
  },
  {
    Item: "Baston de Azufre", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Igneos",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "Orbe Ardiente", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_FIRESTAFF_HELL", Url_Artefacto1: "2H_FIRESTAFF_HELL"
  },
  {
    Item: "Baston Flamigero", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Igneos",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "Pergamino Profano", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_INFERNOSTAFF_MORGANA", Url_Artefacto1: "2H_INFERNOSTAFF_MORGANA"
  },
  {
    Item: "Cancion del Despertar", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Igneos",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "Anillo Armonico Brillante", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_FIRESTAFF_CRYSTAL", Url_Artefacto1: "2H_FIRESTAFF_CRYSTAL"
  },
  {
    Item: "Baston de Caminallamas", Artesano: "Herrero Mágico", TipoItem: "Arma de una Mano", Categoria: "Bastones Igneos",
    Lingotes: 8, Tablas: 16, Telas: 0, Cueros: 0, Artefacto1: "Cristal de Corazon de Pira", CantidadArtefacto1: 1,
    Url_Item: "T4_MAIN_FIRESTAFF_AVALON", Url_Artefacto1: "MAIN_FIRESTAFF_AVALON"
  },

  // Bastones sagrados
  {
    Item: "Baston Sagrado", Artesano: "Herrero Mágico", TipoItem: "Arma de una Mano", Categoria: "Bastones Sagrados",
    Lingotes: 0, Tablas: 16, Telas: 8, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_MAIN_HOLYSTAFF", Url_Artefacto1: "N/A"
  },
  {
    Item: "Gran Baston Sagrado", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Sagrados",
    Lingotes: 0, Tablas: 20, Telas: 12, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_HOLYSTAFF", Url_Artefacto1: "N/A"
  },
  {
    Item: "Baston Divino", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Sagrados",
    Lingotes: 0, Tablas: 20, Telas: 12, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_DIVINESTAFF", Url_Artefacto1: "N/A"
  },
  {
    Item: "Baston de Toque de Vida", Artesano: "Herrero Mágico", TipoItem: "Arma de una Mano", Categoria: "Bastones Sagrados",
    Lingotes: 0, Tablas: 16, Telas: 8, Cueros: 0, Artefacto1: "Pergamino Poseido", CantidadArtefacto1: 1,
    Url_Item: "T4_MAIN_HOLYSTAFF_MORGANA", Url_Artefacto1: "MAIN_HOLYSTAFF_MORGANA"
  },
  {
    Item: "Baston Caido", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Sagrados",
    Lingotes: 0, Tablas: 20, Telas: 12, Cueros: 0, Artefacto1: "Pergamino Infernal", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_HOLYSTAFF_HELL", Url_Artefacto1: "2H_HOLYSTAFF_HELL"
  },
  {
    Item: "Baston de Redencion", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Sagrados",
    Lingotes: 0, Tablas: 20, Telas: 12, Cueros: 0, Artefacto1: "Pergamino Abominable", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_HOLYSTAFF_UNDEAD", Url_Artefacto1: "2H_HOLYSTAFF_UNDEAD"
  },
  {
    Item: "Santificador", Artesano: "Herrero Mágico", TipoItem: "Arma de una Mano", Categoria: "Bastones Sagrados",
    Lingotes: 0, Tablas: 16, Telas: 8, Cueros: 0, Artefacto1: "Rareza Mesianica", CantidadArtefacto1: 1,
    Url_Item: "T4_MAIN_HOLYSTAFF_AVALON", Url_Artefacto1: "MAIN_HOLYSTAFF_AVALON"
  },
  {
    Item: "Baston Exaltado", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Sagrados",
    Lingotes: 0, Tablas: 20, Telas: 12, Cueros: 0, Artefacto1: "Cristal Exaltado", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_HOLYSTAFF_CRYSTAL", Url_Artefacto1: "2H_HOLYSTAFF_CRYSTAL"
  },

  // Bastones arcanos
  {
    Item: "Baston Arcano", Artesano: "Herrero Mágico", TipoItem: "Arma de una Mano", Categoria: "Bastones Arcanos",
    Lingotes: 8, Tablas: 16, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_MAIN_ARCANESTAFF", Url_Artefacto1: "N/A"
  },
  {
    Item: "Gran Baston Arcano", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Arcanos",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_ARCANESTAFF", Url_Artefacto1: "N/A"
  },
  {
    Item: "Baston Enigmatico", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Arcanos",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_ENIGMATICSTAFF", Url_Artefacto1: "N/A"
  },
  {
    Item: "Baston de Brujeria", Artesano: "Herrero Mágico", TipoItem: "Arma de una Mano", Categoria: "Bastones Arcanos",
    Lingotes: 8, Tablas: 16, Telas: 0, Cueros: 0, Artefacto1: "Crital Arcano Perdido", CantidadArtefacto1: 1,
    Url_Item: "T4_MAIN_ARCANESTAFF_UNDEAD", Url_Artefacto1: "MAIN_ARCANESTAFF_UNDEAD"
  },
  {
    Item: "Baston Oculto", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Arcanos",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "Orbe Oculto", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_ARCANESTAFF_HELL", Url_Artefacto1: "2H_ARCANESTAFF_HELL"
  },
  {
    Item: "Locus Malevolo", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Arcanos",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "Catalizador Poseido", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_ENIGMATICSTAFF_MORGANA", Url_Artefacto1: "2H_ENIGMATICSTAFF_MORGANA"
  },
  {
    Item: "Sonido Equilibrado", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Arcanos",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "Anillo Armonico Hipnotico", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_ARCANESTAFF_CRYSTAL", Url_Artefacto1: "2H_ARCANESTAFF_CRYSTAL"
  },
  {
    Item: "Baston Astral", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Arcanos",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "Cristal Estrellado", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_ARCANESTAFF_AVALON", Url_Artefacto1: "2H_ARCANESTAFF_AVALON"
  },

  // Bastones de hielo
  {
    Item: "Baston de Hielo", Artesano: "Herrero Mágico", TipoItem: "Arma de una Mano", Categoria: "Bastones de Hielo",
    Lingotes: 8, Tablas: 16, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_MAIN_FROSTSTAFF", Url_Artefacto1: "N/A"
  },
  {
    Item: "Gran Baston de Hielo", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones de Hielo",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_FROSTSTAFF", Url_Artefacto1: "N/A"
  },
  {
    Item: "Baston Glacial", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones de Hielo",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_GLACIALSTAFF", Url_Artefacto1: "N/A"
  },
  {
    Item: "Baston de Escarchas", Artesano: "Herrero Mágico", TipoItem: "Arma de una Mano", Categoria: "Bastones de Hielo",
    Lingotes: 8, Tablas: 16, Telas: 0, Cueros: 0, Artefacto1: "Orbe de escacha", CantidadArtefacto1: 1,
    Url_Item: "T4_MAIN_FROSTSTAFF_KEEPER", Url_Artefacto1: "MAIN_FROSTSTAFF_KEEPER"
  },
  {
    Item: "Baston de Carambanos", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones de Hielo",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "Orbe de Carambanos", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_ICEAGESTAFF_HELL", Url_Artefacto1: "2H_ICEAGESTAFF_HELL"
  },
  {
    Item: "Prisma de Hielo Perpetuo", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones de Hielo",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "Cristal Congelado Maldito", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_RAMPANTSTAFF_MORGANA", Url_Artefacto1: "2H_RAMPANTSTAFF_MORGANA"
  },
  {
    Item: "Grito Gelido", Artesano: "Herrero Mágico", TipoItem: "Arma de una Mano", Categoria: "Bastones de Hielo",
    Lingotes: 8, Tablas: 16, Telas: 0, Cueros: 0, Artefacto1: "Fragmento Cristalino Helado", CantidadArtefacto1: 1,
    Url_Item: "T4_MAIN_FROSTSTAFF_CRYSTAL", Url_Artefacto1: "MAIN_FROSTSTAFF_CRYSTAL"
  },
  {
    Item: "Baston Artico", Artesano: "Herrero Mágico", TipoItem: "Arma de una Mano", Categoria: "Bastones de Hielo",
    Lingotes: 8, Tablas: 16, Telas: 0, Cueros: 0, Artefacto1: "Cristal Algido", CantidadArtefacto1: 1,
    Url_Item: "T4_MAIN_FROSTSTAFF_AVALON", Url_Artefacto1: "MAIN_FROSTSTAFF_AVALON"
  },

  // Bastones malditos
  {
    Item: "Baston Maldito", Artesano: "Herrero Mágico", TipoItem: "Arma de una Mano", Categoria: "Bastones Malditos",
    Lingotes: 8, Tablas: 16, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_MAIN_CURSEDSTAFF", Url_Artefacto1: "N/A"
  },
  {
    Item: "Gran Baston Maldito", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Malditos",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_CURSEDSTAFF", Url_Artefacto1: "N/A"
  },
  {
    Item: "Baston Demoniaco", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Malditos",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_2H_DEMONICSTAFF", Url_Artefacto1: "N/A"
  },
  {
    Item: "Baston de Maldicion de Vida", Artesano: "Herrero Mágico", TipoItem: "Arma de una Mano", Categoria: "Bastones Malditos",
    Lingotes: 8, Tablas: 16, Telas: 0, Cueros: 0, Artefacto1: "Cristal Maldito Perdido", CantidadArtefacto1: 1,
    Url_Item: "T4_MAIN_CURSEDSTAFF_UNDEAD", Url_Artefacto1: "MAIN_CURSEDSTAFF_UNDEAD"
  },
  {
    Item: "Calavera Maldita", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Malditos",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "Quijada Maldita", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_SKULL_HELL", Url_Artefacto1: "2H_SKULL_HELL"
  },
  {
    Item: "Baston de Maldiciones", Artesano: "Herrero Mágico", TipoItem: "Arma de dos Manos", Categoria: "Bastones Malditos",
    Lingotes: 12, Tablas: 20, Telas: 0, Cueros: 0, Artefacto1: "Catalizador Forjado con Sangre", CantidadArtefacto1: 1,
    Url_Item: "T4_2H_CURSEDSTAFF_MORGANA", Url_Artefacto1: "2H_CURSEDSTAFF_MORGANA"
  },
  {
    Item: "Invocador Oscuro", Artesano: "Herrero Mágico", TipoItem: "Arma de una Mano", Categoria: "Bastones Malditos",
    Lingotes: 8, Tablas: 16, Telas: 0, Cueros: 0, Artefacto1: "Orbe Opaco Fracturado", CantidadArtefacto1: 1,
    Url_Item: "T4_MAIN_CURSEDSTAFF_AVALON", Url_Artefacto1: "MAIN_CURSEDSTAFF_AVALON"
  },
  {
    Item: "Baston Putrefacto", Artesano: "Herrero Mágico", TipoItem: "Arma de una Mano", Categoria: "Bastones Malditos",
    Lingotes: 8, Tablas: 16, Telas: 0, Cueros: 0, Artefacto1: "Cristal Putrefacto", CantidadArtefacto1: 1,
    Url_Item: "T4_MAIN_CURSEDSTAFF_CRYSTAL", Url_Artefacto1: "MAIN_CURSEDSTAFF_CRYSTAL"
  },

  // Segunda mano / Libros
  {
    Item: "Libro", Artesano: "Herrero Mágico", TipoItem: "Segunda Mano", Categoria: "Libros",
    Lingotes: 0, Tablas: 0, Telas: 4, Cueros: 4, Artefacto1: "N/A", CantidadArtefacto1: 0,
    Url_Item: "T4_OFF_BOOK", Url_Artefacto1: "N/A"
  },
  {
    Item: "Ojo de los Secretos", Artesano: "Herrero Mágico", TipoItem: "Segunda Mano", Categoria: "Libros",
    Lingotes: 0, Tablas: 0, Telas: 4, Cueros: 4, Artefacto1: "Cristal Tentador", CantidadArtefacto1: 1,
    Url_Item: "T4_OFF_BOOK_KEEPER", Url_Artefacto1: "OFF_BOOK_KEEPER"
  },
  {
    Item: "Muisak", Artesano: "Herrero Mágico", TipoItem: "Segunda Mano", Categoria: "Libros",
    Lingotes: 0, Tablas: 0, Telas: 4, Cueros: 4, Artefacto1: "Quijada Demoniaca", CantidadArtefacto1: 1,
    Url_Item: "T4_OFF_TOTEM_HELL", Url_Artefacto1: "OFF_TOTEM_HELL"
  },
  {
    Item: "Raiz Primaria", Artesano: "Herrero Mágico", TipoItem: "Segunda Mano", Categoria: "Libros",
    Lingotes: 0, Tablas: 0, Telas: 4, Cueros: 4, Artefacto1: "Piedra Inscrita", CantidadArtefacto1: 1,
    Url_Item: "T4_OFF_OBELISK_LST_KEEPER", Url_Artefacto1: "OFF_OBELISK_LST_KEEPER"
  },
  {
    Item: "Incensario Celestial", Artesano: "Herrero Mágico", TipoItem: "Segunda Mano", Categoria: "Libros",
    Lingotes: 0, Tablas: 0, Telas: 4, Cueros: 4, Artefacto1: "Recuerdo Celestial Roto", CantidadArtefacto1: 1,
    Url_Item: "T4_OFF_CENSER_AVALON", Url_Artefacto1: "OFF_CENSER_AVALON"
  },
  {
    Item: "Grimorio", Artesano: "Herrero Mágico", TipoItem: "Segunda Mano", Categoria: "Libros",
    Lingotes: 0, Tablas: 0, Telas: 4, Cueros: 4, Artefacto1: "Cristal de bloqueo de tiempo", CantidadArtefacto1: 1,
    Url_Item: "T4_OFF_BOOK_CRYSTAL", Url_Artefacto1: "OFF_BOOK_CRYSTAL"
  }
];

// Returns the ideal city for each recipe category
export function getIdealCraftingCity(category: string): AlbionCity | null {
  switch (category) {
    case 'Espadas': return 'Lymhurst';
    case 'Hachas': return 'Martlock';
    case 'Martillos': return 'Fort Sterling';
    case 'Mazas': return 'Thetford';
    case 'Guantes': return 'Caerleon';
    case 'Escudos': return 'Martlock';
    case 'Ballestas': return 'Bridgewatch';
    case 'Casco de Placa': return 'Fort Sterling';
    case 'Botas de Placa': return 'Martlock';
    case 'Armaduras de Placa': return 'Bridgewatch';
    
    // Herrero Mágico Categories
    case 'Sandalias de Telas': return 'Fort Sterling';
    case 'Tunicas de Telas': return 'Thetford';
    case 'Habitos de Telas': return 'Lymhurst';
    case 'Bastones Igneos': return 'Thetford';
    case 'Bastones Sagrados': return 'Bridgewatch';
    case 'Bastones Arcanos': return 'Caerleon';
    case 'Bastones de Hielo': return 'Lymhurst';
    case 'Bastones Malditos': return 'Caerleon';
    case 'Libros': return 'Lymhurst';
    default: return null;
  }
}

// Multiplier (MT) for base fame depending on tier
export const FAME_TIER_MULTIPLIERS: Record<ItemTier, number> = {
  T4: 22.5,
  T5: 90,
  T6: 270,
  T7: 645,
  T8: 1395
};

// Journal/Book capacities by tier
export const JOURNAL_CAPACITIES_BY_TIER: Record<ItemTier, number> = {
  T4: 3600,
  T5: 7200,
  T6: 14400,
  T7: 28380,
  T8: 58590
};

// Base Item Values (IV) for refined materials by tier
export const BASE_MATERIAL_IV: Record<ItemTier, number> = {
  T4: 16,
  T5: 32,
  T6: 64,
  T7: 128,
  T8: 256
};

// Cities list
export const ALBION_CITIES: AlbionCity[] = [
  'Lymhurst',
  'Martlock',
  'Thetford',
  'Fort Sterling',
  'Bridgewatch',
  'Caerleon',
  'Mercado Negro'
];

// Helper to generate a realistic initial set of material prices for all cities
export function createDefaultPrices(): GlobalPricesState {
  const tiers: ItemTier[] = ['T4', 'T5', 'T6', 'T7', 'T8'];
  const enchantments: EnchantmentLevel[] = [0, 1, 2, 3, 4];
  
  // Base prices for T4.0 we'll scale on
  const bases = {
    lingotes: 120,
    tablas: 110,
    telas: 105,
    cueros: 130
  };

  const state = {} as GlobalPricesState;

  for (const city of ALBION_CITIES) {
    state[city] = {
      lingotes: {} as Record<ItemTier, Record<EnchantmentLevel, number>>,
      tablas: {} as Record<ItemTier, Record<EnchantmentLevel, number>>,
      telas: {} as Record<ItemTier, Record<EnchantmentLevel, number>>,
      cueros: {} as Record<ItemTier, Record<EnchantmentLevel, number>>,
      artefactos: {}
    } as MaterialPriceRecord;

    for (const tier of tiers) {
      state[city].lingotes[tier] = {} as Record<EnchantmentLevel, number>;
      state[city].tablas[tier] = {} as Record<EnchantmentLevel, number>;
      state[city].telas[tier] = {} as Record<EnchantmentLevel, number>;
      state[city].cueros[tier] = {} as Record<EnchantmentLevel, number>;

      // Tier multipliers
      let tierMult = 1;
      if (tier === 'T5') tierMult = 2.8;
      else if (tier === 'T6') tierMult = 7.5;
      else if (tier === 'T7') tierMult = 22.0;
      else if (tier === 'T8') tierMult = 65.0;

      // Add a slight natural city variance to make markets feel alive and real
      const variance = city === 'Lymhurst' ? 0.95 :
                       city === 'Martlock' ? 1.05 :
                       city === 'Thetford' ? 0.98 :
                       city === 'Fort Sterling' ? 1.02 :
                       city === 'Bridgewatch' ? 1.0 :
                       city === 'Caerleon' ? 1.15 : 1.25; // black market is higher

      for (const ench of enchantments) {
        // Enchantment multiplier: .0 -> 1x, .1 -> 2.2x, .2 -> 4.8x, .3 -> 11x, .4 -> 25x
        let enchMult = 1;
        if (ench === 1) enchMult = 2.2;
        else if (ench === 2) enchMult = 4.8;
        else if (ench === 3) enchMult = 11.0;
        else if (ench === 4) enchMult = 25.0;

        const finalLingote = Math.round(bases.lingotes * tierMult * enchMult * variance);
        const finalTabla = Math.round(bases.tablas * tierMult * enchMult * variance);
        const finalTela = Math.round(bases.telas * tierMult * enchMult * variance);
        const finalCuero = Math.round(bases.cueros * tierMult * enchMult * variance);

        state[city].lingotes[tier][ench] = finalLingote;
        state[city].tablas[tier][ench] = finalTabla;
        state[city].telas[tier][ench] = finalTela;
        state[city].cueros[tier][ench] = finalCuero;
      }
    }

    // Seed artifact price defaults based on artifact names
    const artifactNames = [
      "Atadura antigua", "Relleno demoniaco", "Atadura Inscrita", "Garra de TejeVelos", "Greba Exaltada",
      "Cota de Malla Antigua", "Placas Demoniacas", "Pieles de Animal Precervadas", "Caparazon de TejeVelos",
      "Enchapado Exaltado", "Acolchado Antiguo", "Esquirlas Demoniacas", "Acolchado de Calavera Tallada",
      "Mandibulas de TejeVelos", "Viceras Exaltada", "Hoja Forjada con Sangre", "Hoja Demoniaca", "Hojas Malditas",
      "Restos del Rey Viejo", "Cristal Infinito", "Cabeza de Alabarda de Morgana", "Cabeza de Hoz Demoniaca",
      "Cabeza de Hachas de Guardian", "Recuerdos de Batallas Avaloniana", "Crital Afilado", "Roca Runica",
      "Cabeza de Maza Infernal", "Cabeza de Maza Imbuida", "Juramentos Rotos", "Cristal de la Tormenta",
      "Cabeza de Martillo Antigua", "Cabezas de Martillo Diabolicas", "Tronco Grabado", "Mano Metalica Masiva",
      "Cristal Crepitante", "Restos de Guardian", "Cuernos Demoniacos Rotos", "Placa de Cuervo Deforme",
      "Guantaletes Avalonianos Dañados", "Cristal Pulsantes", "Mecanismo Perdido de Ballesta", "Saetas Diabolicas",
      "Saetas Tentadoras", "Veleta de Zumbido Avaloniano", "Cristal de Luz", "Nucleo de Escudo Antiguo",
      "Nucleo de Escudo Infernal", "Puas Forjadas con Sangre", "Reliquia Avaloniana Destruida", "Cristal Inquebrantable",
      
      // Herrero Mágico Artifacts
      "Ataduras Druidas", "Ataduras de Tela Infernal", "Ataduras Tentadoras", "Escamas de Dragon Feerricas", "Ataduras Santificadoras",
      "Plumas Druidas", "Pliegues de Tela Infernal", "Amuleto Tentador", "Ala Dorsal Feericas", "Cinturon Santificador",
      "Pico Preservado Druida", "Vicera de Tela Infernal", "Acolchado Tentador", "Fibula Feerica Intacta", "Mascara Santificadora",
      "Orbe de Fuego Incontrolable", "Orbe Ardiente", "Pergamino Profano", "Anillo Armonico Brillante", "Cristal de Corazon de Pira",
      "Pergamino Poseido", "Pergamino Infernal", "Pergamino Abominable", "Rareza Mesianica", "Cristal Exaltado",
      "Crital Arcano Perdido", "Orbe Oculto", "Catalizador Poseido", "Anillo Armonico Hipnotico", "Cristal Estrellado",
      "Orbe de escacha", "Orbe de Carambanos", "Cristal Congelado Maldito", "Fragmento Cristalino Helado", "Cristal Algido",
      "Cristal Maldito Perdido", "Quijada Maldita", "Catalizador Forjado con Sangre", "Orbe Opaco Fracturado", "Cristal Putrefacto",
      "Cristal Tentador", "Quijada Demoniaca", "Piedra Inscrita", "Recuerdo Celestial Roto", "Cristal de bloqueo de tiempo"
    ];

    for (const art of artifactNames) {
      state[city].artefactos[art] = {
        T4: 2500,
        T5: 6800,
        T6: 18500,
        T7: 54000,
        T8: 165000
      };
    }
  }

  return state;
}

// Generate the official Albion render URL for items or artifacts
export const ITEM_FALLBACK_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" fill="%231a202c" rx="12" stroke="%234a5568" stroke-width="2"/><circle cx="64" cy="64" r="32" fill="%232d3748" stroke="%23718096" stroke-width="2" stroke-dasharray="4 4"/><path d="M40 88l14-14 4 4-14 14zm16-16l32-32c2-2 5-2 7 0s2 5 0 7L49 79" stroke="%23d69e2e" stroke-width="4" stroke-linecap="round"/><path d="M78 40l10 10" stroke="%23cbd5e0" stroke-width="3" stroke-linecap="round"/><circle cx="36" cy="92" r="4" fill="%23a0aec0"/></svg>`;

export const JOURNAL_FALLBACK_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" fill="%231a365d" rx="12" stroke="%232b6cb0" stroke-width="2"/><path d="M35 25h50a8 8 0 0 1 8 8v65a8 8 0 0 1-8 8H35a4 4 0 0 1-4-4V29a4 4 0 0 1 4-4z" fill="%232d3748" stroke="%23e2e8f0" stroke-width="2"/><path d="M31 35h54v5H31zM31 85h54v2H31zM45 45h30v3H45zm0 10h30v3H45zm0 10h20v3H45z" fill="%23cbd5e0"/><path d="M31 29a4 4 0 0 1 4-4h4v74h-4a4 4 0 0 1-4-4z" fill="%23c53030"/></svg>`;

export const MATERIAL_FALLBACK_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" fill="%232d3748" rx="12" stroke="%234a5568" stroke-width="2"/><path d="M30 40h68l-10 45H40z" fill="%23718096" stroke="%23e2e8f0" stroke-width="2"/><path d="M50 35l14-15 14 15" stroke="%23cbd5e0" stroke-width="4" stroke-linecap="round" fill="none"/></svg>`;

/**
 * Generic image error handler for Albion Online render URLs.
 * Resolves CORS/network blocking by retrying without extension, 
 * then showing a beautiful vector fallback of the item if all else fails.
 */
export function handleImageLoadError(e: any) {
  const img = e.currentTarget;
  if (!img) return;

  if (img.dataset.hasFailedTwice) {
    return;
  }

  const currentSrc = img.src || '';

  // 1. Try resolving without .png extension (some endpoints behave better without extension)
  if (currentSrc.includes('.png') && !img.dataset.attemptedNoPng) {
    img.dataset.attemptedNoPng = 'true';
    img.src = currentSrc.replace(/\.png$/, '');
    return;
  }

  // 2. Set second failure flag
  img.dataset.hasFailedTwice = 'true';

  // 3. Set standard fallback depending on the item type (journal, material, or general item)
  const lowerAlt = (img.alt || '').toLowerCase();
  const lowerSrc = currentSrc.toLowerCase();

  if (lowerAlt.includes('diario') || lowerSrc.includes('journal')) {
    img.src = JOURNAL_FALLBACK_SVG;
  } else if (
    lowerAlt.includes('lingote') || 
    lowerAlt.includes('tabla') || 
    lowerAlt.includes('tela') || 
    lowerAlt.includes('cuero') || 
    lowerSrc.includes('metalbar') || 
    lowerSrc.includes('planks') || 
    lowerSrc.includes('cloth') || 
    lowerSrc.includes('leather')
  ) {
    img.src = MATERIAL_FALLBACK_SVG;
  } else {
    img.src = ITEM_FALLBACK_SVG;
  }
}

export function getAlbionRenderUrl(itemId: string, tier: ItemTier, enchantment: EnchantmentLevel): string {
  if (!itemId || itemId === 'N/A') return '';
  
  // Replace the T4 prefix with the user selected tier
  let resolvedId = itemId.replace(/^T4_/, `${tier}_`);
  
  // Append enchantment suffix if it is greater than 0
  if (enchantment > 0) {
    resolvedId = `${resolvedId}@${enchantment}`;
  }
  
  return `https://render.albiononline.com/v1/item/${resolvedId}.png`;
}

// Generate the official Albion render URL for artifacts
export function getAlbionArtifactRenderUrl(artifactId: string, tier: ItemTier): string {
  if (!artifactId || artifactId === 'N/A') return '';
  
  let code = artifactId;
  // If artifactId already starts with a tier prefix (e.g., T4_, T5_, etc.), strip it
  if (/^T\d_/.test(code)) {
    code = code.replace(/^T\d_/, '');
  }
  
  // Ensure the code starts with the "ARTEFACT_" prefix
  if (!code.startsWith('ARTEFACT_')) {
    code = `ARTEFACT_${code}`;
  }
  
  const resolvedId = `${tier}_${code}`;
  return `https://render.albiononline.com/v1/item/${resolvedId}.png`;
}

// Get the material render URL based on type, tier, and enchantment
export function getMaterialRenderUrl(type: 'lingotes' | 'tablas' | 'telas' | 'cueros', tier: ItemTier, enchantment: EnchantmentLevel): string {
  let itemCode = '';
  switch (type) {
    case 'lingotes':
      itemCode = 'METALBAR';
      break;
    case 'tablas':
      itemCode = 'PLANKS';
      break;
    case 'telas':
      itemCode = 'CLOTH';
      break;
    case 'cueros':
      itemCode = 'LEATHER';
      break;
  }
  let resolvedId = `${tier}_${itemCode}`;
  if (enchantment > 0) {
    resolvedId = `${resolvedId}_LEVEL${enchantment}`;
  }
  return `https://render.albiononline.com/v1/item/${resolvedId}.png`;
}

// Get artifact render URL by its Spanish name, searching the recipe database or utilizing manual fallback
export function getArtifactRenderUrlByName(name: string, tier: ItemTier): string {
  if (!name || name === 'N/A') return '';

  // 1. Double-check custom exact mappings
  const directMappings: Record<string, string> = {
    // Herrero / Armaduras de placa
    "Atadura antigua": "SHOES_PLATE_UNDEAD",
    "Relleno demoniaco": "SHOES_PLATE_HELL",
    "Atadura Inscrita": "SHOES_PLATE_KEEPER",
    "Garra de TejeVelos": "SHOES_PLATE_FEY",
    "Greba Exaltada": "SHOES_PLATE_AVALON",
    "Cota de Malla Antigua": "ARMOR_PLATE_UNDEAD",
    "Placas Demoniacas": "ARMOR_PLATE_HELL",
    "Pieles de Animal Precervadas": "ARMOR_PLATE_KEEPER",
    "Caparazon de TejeVelos": "ARMOR_PLATE_FEY",
    "Enchapado Exaltado": "ARMOR_PLATE_AVALON",
    "Acolchado Antiguo": "HEAD_PLATE_UNDEAD",
    "Esquirlas Demoniacas": "HEAD_PLATE_HELL",
    "Acolchado de Calavera Tallada": "HEAD_PLATE_KEEPER",
    "Mandibulas de TejeVelos": "HEAD_PLATE_FEY",
    "Viceras Exaltada": "HEAD_PLATE_AVALON",

    // Espadas
    "Hoja Forjada con Sangre": "MAIN_SWORD_HELL",
    "Hoja Demoniaca": "2H_DUALSWORD_HELL",
    "Hojas Malditas": "2H_CLEAVER_HELL",
    "Restos del Rey Viejo": "2H_CLAYMORE_UNDEAD",
    "Cristal Infinito": "2H_SWORD_AVALON",

    // Hachas
    "Cabeza de Alabarda de Morgana": "MAIN_HALBERD_MORGANA",
    "Cabeza de Hoz Demoniaca": "2H_HALBERD_HELL",
    "Cabeza de Hachas de Guardian": "2H_SCYTHE_KEEPER",
    "Recuerdos de Batallas Avaloniana": "2H_AXE_AVALON",
    "Crital Afilado": "2H_HALBERD_PLAYERSSET",

    // Mazas
    "Roca Runica": "MAIN_MACE_KEEPER",
    "Cabeza de Maza Infernal": "2H_MACE_HELL",
    "Cabeza de Maza Imbuida": "2H_FLAIL_UNKOWN", // Handled below or safely mapped
    "Juramentos Rotos": "2H_MACE_MORGANA",
    "Cristal de la Tormenta": "2H_MACE_AVALON",

    // Martillos
    "Cabeza de Martillo Antigua": "MAIN_HAMMER_UNDEAD",
    "Cabezas de Martillo Diabolicas": "2H_HAMMER_HELL",
    "Tronco Grabado": "2H_RAM_KEEPER",
    "Mano Metalica Masiva": "2H_HAMMER_MORGANA",
    "Cristal Crepitante": "2H_HAMMER_AVALON",

    // Ballestas
    "Restos de Guardian": "MAIN_BOLTS_KEEPER",
    "Cuernos Demoniacos Rotos": "2H_CROSSBOW_HELL",
    "Placa de Cuervo Deforme": "2H_CROSSBOWLARGE_MORGANA",
    "Guantaletes Avalonianos Dañados": "2H_REPEATINGCROSSBOW_AVALON",
    "Cristal Pulsantes": "2H_REPEATINGCROSSBOW_AVALON", // Similar
    "Mecanismo Perdido de Ballesta": "T4_ARTEFACT_CROSSBOW", // generic
    "Saetas Diabolicas": "2H_BOLTS_HELL",
    "Saetas Tentadoras": "2H_COMBATBOLTS_KEEPER",
    "Veleta de Zumbido Avaloniano": "T4_ARTEFACT_AVALON",
    "Cristal de Luz": "T4_ARTEFACT_AVALON",

    // Escudos
    "Nucleo de Escudo Antiguo": "OFF_SHIELD_UNDEAD",
    "Nucleo de Escudo Infernal": "OFF_SHIELD_HELL",
    "Puas Forjadas con Sangre": "OFF_TOWERSHIELD_KEEPER",
    "Reliquia Avaloniana Destruida": "OFF_SHIELD_AVALON",
    "Cristal Inquebrantable": "OFF_SHIELD_AVALON"
  };

  if (directMappings[name]) {
    return getAlbionArtifactRenderUrl(directMappings[name], tier);
  }

  // 2. Fallback search inside ITEM_RECIPES
  const foundRecipe = ITEM_RECIPES.find(r => r.Artefacto1 === name);
  if (foundRecipe && foundRecipe.Url_Artefacto1 !== 'N/A') {
    return getAlbionArtifactRenderUrl(foundRecipe.Url_Artefacto1, tier);
  }

  // 3. Last resort visual representation
  // General artifact codes by word matching
  let resolvedCode = 'MAIN_SWORD'; // default (will be prefixed with ARTEFACT_ by getAlbionArtifactRenderUrl)
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('demon') || lowerName.includes('hell') || lowerName.includes('diabol')) {
    resolvedCode = 'ARMOR_PLATE_HELL';
  } else if (lowerName.includes('antig') || lowerName.includes('viej') || lowerName.includes('undead')) {
    resolvedCode = 'ARMOR_PLATE_UNDEAD';
  } else if (lowerName.includes('avalon')) {
    resolvedCode = 'ARMOR_PLATE_AVALON';
  } else if (lowerName.includes('escudo') || lowerName.includes('shield')) {
    resolvedCode = 'OFF_SHIELD';
  } else if (lowerName.includes('cristal')) {
    resolvedCode = 'MAIN_SWORD';
  }

  return getAlbionArtifactRenderUrl(resolvedCode, tier);
}
