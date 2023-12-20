export class Articles {
    titulo: string;
    dias_uso: number;
    costo: number;
    ejercicios: string;
    cant_ejer: number;
    tiempo_ejer: number;
    acceso_maquinas: string;
    consejos_nutr: string;
    agenda_semanal: string;
    horario_per: string;
    eventos: string;
    proteina: string;
    clases_per: string;
    articleId: number;

    constructor(titulo: string, dias_uso: number, costo: number, ejercicios: string,
                cant_ejer: number, tiempo_ejer: number, acceso_maquinas: string, consejos_nutr: string,
                agenda_semanal: string, horario_per: string, eventos: string, proteina: string, clases_per: string,
                articleId: number) {
        this.titulo = titulo,
        this.dias_uso = dias_uso,
        this.costo = costo,
        this.ejercicios = ejercicios,
        this.cant_ejer = cant_ejer,
        this.tiempo_ejer = tiempo_ejer,
        this.acceso_maquinas = acceso_maquinas,
        this.consejos_nutr = consejos_nutr,
        this.agenda_semanal = agenda_semanal,
        this.horario_per = horario_per,
        this.eventos = eventos,
        this.proteina = proteina,
        this.clases_per = clases_per
        this.articleId = articleId
    }
}

