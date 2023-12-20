export class Insert {
    id:number;
    titulo: string;
    costo: number;
    articleId: number;

    constructor(id:number,titulo: string, costo: number, articleId: number) {
        this.id = id,
        this.titulo = titulo,
        this.costo = costo,
        this.articleId = articleId
    }
}

