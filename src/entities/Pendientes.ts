import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("Pendientes")
export class Pendientes {
  @PrimaryGeneratedColumn({
    type: "integer",
    name: "id",
  })
  id: number;

  @Column("text", { name: "pendiente", nullable: false })
  pendiente: string;

  @Column("integer", { name: "ce", nullable: false })
  ce: number;

  @Column("integer", { name: "cm", nullable: false })
  cm: number;

  @Column("integer", { name: "puntaje", nullable: false })
  puntaje: number;
}
