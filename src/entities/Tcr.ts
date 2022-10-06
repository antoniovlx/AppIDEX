import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("Tcr")
export class Tcr {
  @PrimaryGeneratedColumn({
    type: "integer",
    name: "id",
  })
  id: number;

  @Column("text", { name: "modelo", nullable: false })
  modelo: string;

  @Column("text", { name: "pendiente", nullable: false })
  pendiente: string;

  @Column("text", { name: "humedad", nullable: false })
  humedad: number;

  @Column("text", { name: "velocidad", nullable: false })
  velocidad: number;

  @Column("text", { name: "velocidadPropagacion", nullable: false })
  velocidadPropagacion: number;

  @Column("text", { name: "longitudLlama", nullable: false })
  longitudLlama: number;

  @Column("text", { name: "focosSecundarios", nullable: false })
  focosSecundarios: number;
}
