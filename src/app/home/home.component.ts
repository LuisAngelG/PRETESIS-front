import { Component, ElementRef, EmbeddedViewRef, OnInit, ViewChild, numberAttribute } from '@angular/core';
import { UserService } from '../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Articles } from '../models/articles';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StorageService } from '../service/storage.service';
import { Intermediate } from '../service/intermediate.service';
import { Subject } from 'rxjs';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Insert } from '../models/article';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit{

  currentUser: any;
  content?: string;
  tarjetas: any[] = [];
  articulos: any[] = [];
  guardado: any[] = [];
  message = new Subject();
  isLoggedIn = false
  //modificacion para iniciar como admin
  isAdmin = false
  articleId = 0

  articlesForm: FormGroup

  selectedItem = 0;
  status?: string;
  tarjetasSuscritas = false
  respuesta: any
  btnsTocadosSinPermiso = false;  

  constructor(private userService: UserService, 
              private router: Router, 
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private storageService: StorageService, 
              private articleService: UserService, 
              private datosService:Intermediate) { 

    //LLAMADO AL FORMULARIO PARA INGRESAR UNA SUSCRIPCION AL USUARIO
    this.articlesForm = this.fb.group({
      titulo: '',
      dias_uso: 0,
      costo: 0,
      ejercicios: '',
      cant_ejer: 0,
      tiempo_ejer: 0,
      acceso_maquinas: '',
      consejos_nutr: '',
      agenda_semanal: '',
      horario_per: '',
      eventos: '',
      proteina: '',
      clases_per: '',
      articleId: ''
    })
  }

  private showSweetAlert(message: string, icon: SweetAlertIcon = 'info'): void {
    Swal.fire({
      title: message,
      icon: icon,
      confirmButtonText: 'Cerrar'
    });
  }

  ngOnInit(): void {

    this.insertArticle()
    // Obtén la URL actual
    var url = new URL(window.location.href);

    // Elimina los parámetros que desees
    url.searchParams.delete('status');
    url.searchParams.delete('id');
    url.searchParams.delete('articleId');

    // Reemplaza la URL actual en el historial del navegador
    window.history.replaceState({}, document.title, url.href);

    this.currentUser = this.storageService.getUser().roles;
    
    if(this.storageService.isLoggedIn()){

      const id = this.storageService.getUser().id

      this.isLoggedIn = true; 

      if(this.currentUser == "ROLE_ADMIN"){
        this.isAdmin = true
        console.log(this.currentUser)
        this.userService.getAdminBoard().subscribe({
          next: data => {
            this.content = data;
            this.showSweetAlert("Bienvenido ADMIN", 'info')
          },
          error: err => {console.log(err)
            if (err.error) {
              this.content = JSON.parse(err.error).message;
            } else {
              this.content = "Error with status: " + err.status;
            }
          }
        });
        console.log("ingresas como admin")
      }else{
        this.isAdmin = false
        this.userService.getArticlesToUser(id).subscribe({
          next: datas =>{
            this.tarjetas = datas;
            this.tarjetasSuscritas = true
            console.log(datas)
          },
          error: err => { console.log(err)
            if (err.error){
              this.tarjetas = JSON.parse(err.error).message;
            }
          }
        })
        this.userService.getUserBoard().subscribe({
          next: data => {
            this.content = data;
            this.showSweetAlert("Bienvenido a Gimnasio Columbus", 'info')
          },
          error: err => { console.log(err)
            if (err.error){
              this.content = JSON.parse(err.error).message;
            }
          }
        })
        console.log("ingresas como user")
        
      }
  }  
  
  this.getArticle()     
}

  generarTarjetasSuscritas(id: number):any{
    if(this.articulos[id].articleId === this.storageService.getUser().id){
      this.tarjetasSuscritas = true
    }else{
      return false
    }
  }

  //configuracion para el boton
  marcarComoTocado() {
    this.btnsTocadosSinPermiso = true;
  }

  //obtener el total de articulos disponibles
  getArticle():any {
    this.userService.getElements().subscribe({
      next: data => {
        this.articulos = data.filter(item => item.articleId === null);
        console.log(this.articulos);
        if(this.status == "approved"){
          this.status = "default"
          this.addArticleToUser(this.selectedItem)
        }else{
          if(this.currentUser == "ROLE_USER" ){

          }else if(this.currentUser == "ROLE_ADMIN"){
              
          }else{
            this.showSweetAlert("Si desea generar una compra, ingrese primero", 'info')
          }
        }
      },
      error: err => {
        console.log(err);
        if (err.error) {
          this.articulos = JSON.parse(err.error).message;
        } else {
          this.showSweetAlert('Articulos no obtenidos', 'error');
        }
      }
    });
  }

  addArticle(id: number) {

    const id2 = id - 1

    const INSERT: Insert = {
      //añadir id por prueba
      id: this.articulos[id2].id,
      titulo: this.articulos[id2].titulo,
      costo: this.articulos[id2].costo,
      articleId: this.storageService.getUser().id
    }

    console.log(INSERT)

    this.userService.postOrderToUser(INSERT).subscribe({
      next: data => {
        window.location.href = data.init_point;
      },
      error: err => {
        console.log(err);
        // Muestra el mensaje de error directamente
        this.showSweetAlert('Error al procesar la solicitud', 'error');
      }
    });
  }

  insertArticle(){
    this.route.queryParams.subscribe(params => {
      this.selectedItem = params['id'] || 'default';
      this.articleId = parseInt(params['articleId'], 10) || 0

      const { status } = params;
      this.status = status || 'default';
    });
  }

  addArticleToUser(id: number) {

    const id2 = id - 1;

    const ARTICLES: Articles = {
      titulo: this.articulos[id2].titulo,
      dias_uso: this.articulos[id2].dias_uso,
      costo: this.articulos[id2].costo,
      ejercicios: this.articulos[id2].ejercicios,
      cant_ejer: this.articulos[id2].cant_ejer,
      tiempo_ejer: this.articulos[id2].tiempo_ejer,
      acceso_maquinas: this.articulos[id2].acceso_maquinas,
      consejos_nutr: this.articulos[id2].consejos_nutr,
      agenda_semanal: this.articulos[id2].agenda_semanal,
      horario_per: this.articulos[id2].horario_per,
      eventos: this.articulos[id2].eventos,
      proteina: this.articulos[id2].proteina,
      clases_per: this.articulos[id2].clases_per,
      articleId: this.articleId
    };

    console.log(ARTICLES);

    this.userService.postArticlesToUser(ARTICLES).subscribe({
        next: data => {
          const addedArticleId = data.articleId;

          if (addedArticleId == null) {
            console.log("ERROR" + addedArticleId);
          } else {
            console.log(data);
            location.reload();
          }

        },
        error: err => {
            console.log("FALLO EN AÑADIR");
        }
    });
  }
}

