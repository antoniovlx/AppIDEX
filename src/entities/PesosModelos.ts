import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("PesosModelos")
export class PesosModelos {
  @PrimaryGeneratedColumn({
    type: "integer",
    name: "id",
  })
  id: number;

  @Column("text", { name: "modelo", nullable: false })
  modelo: string;

  @Column("decimal", { name: "calorSuperficial", nullable: false })
  calorSuperficial: number;

  @Column("integer", { name: "manual", nullable: false })
  manual: number;

  @Column("integer", { name: "mecanizado", nullable: false })
  mecanizado: number;

  @Column("integer", { name: "pesoSuperficial", nullable: false })
  superficial: number;

  @Column("integer", { name: "pesoDificultad", nullable: false })
  dificultad: number;
}
