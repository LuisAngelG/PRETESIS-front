import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { StorageService } from 'src/app/service/storage.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  
  loginForm: FormGroup;

  isLoggedIn = false
  isLoginFailed = false
  errorMessage = ''
  roles: string[] =[]

  constructor(private authService: AuthService,
              private storageService: StorageService,
              private emailVrf: AngularFireAuth,
              private fb: FormBuilder,
              private router: Router){ 
                this.loginForm = this.fb.group(
                  {
                      email: ['', Validators.required],
                      password: ['', Validators.required]
                  }
                )
              }

              private showSweetAlert(message: string, icon: SweetAlertIcon = 'info'): void {
                Swal.fire({
                  title: message,
                  icon: icon,
                  confirmButtonText: 'Cerrar'
                });
              }


  ngOnInit(): void {
    if(this.storageService.isLoggedIn()){
      this.roles = this.storageService.getUser().roles
    }
  }

  onSubmit(): void {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
  
    // Verificar si el usuario ya existe
    this.emailVrf.fetchSignInMethodsForEmail(email).then((signInMethods) => {
      if (signInMethods.length === 0) {
        // No hay métodos de inicio de sesión asociados, el usuario no existe
        this.showSweetAlert('El usuario no existe', 'error');
      } else {
        // El usuario existe, intentar iniciar sesión
        this.emailVrf.signInWithEmailAndPassword(email, password).then((user) => {
          if (user.user?.emailVerified) {
            this.ingresarUsuario();
          } else {
            this.showSweetAlert('Email no verificado', 'error');
          }
        }).catch((error) => {
          // Manejo de errores
          if (error.code === 'auth/wrong-password') {
            this.showSweetAlert('Contraseña incorrecta. Por favor, inténtelo de nuevo.', 'error');
            // Puedes mostrar un mensaje al usuario o realizar otras acciones específicas
          } else {
            console.error('Error al iniciar sesión', error);
            // Manejo de otros errores
          }
        });
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  



  ingresarUsuario(){
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.login(email, password).subscribe({
      next:data => {
        this.storageService.saveUser(data)
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles
        this.reloadPage()
      },
      error:err => {
        this.errorMessage = err.error.message
        this.isLoginFailed = true
      }
    })
  }
    
  
  reloadPage(): void{
    this.router.navigate(['/home'])
  }

}
