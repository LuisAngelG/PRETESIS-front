import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registrarUsuario: FormGroup;

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = ''

  constructor(
      private authService: AuthService, 
      private emailVrf: AngularFireAuth,
      private fb: FormBuilder,
      private route:Router) { 
    this.registrarUsuario = this.fb.group(
      {
          username: ['', Validators.required],
          password: ['', Validators.required],
          email: ['', Validators.required],
          repeatpassword: ['', Validators.required]
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

  }

  onSubmit(): void {

    const username = this.registrarUsuario.value.username;
    const email = this.registrarUsuario.value.email;
    const password = this.registrarUsuario.value.password;
    const repeatpassword = this.registrarUsuario.value.repeatpassword;

    if(repeatpassword == password){
      
      this.authService.register(username, email, password).subscribe({
        next: data=>{
          this.emailVrf.createUserWithEmailAndPassword(email, password).then((user) => {
            console.log(data)
            this.isSuccessful=true;
            this.isSignUpFailed= false;
            this.verificarCorreo();
            this.showSweetAlert('Email enviado, confirmar por favor', 'info');
          }).catch((firebaseError) => {
            // Maneja errores de Firebase
            this.isSignUpFailed = true;
            this.errorMessage = firebaseError.message;
            this.showSweetAlert('Email en uso', 'error');
          });
        },
        error: (err) => {
          this.isSignUpFailed = true;
          this.errorMessage = err.error.message;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: this.errorMessage,
          });
        },
      })
    }
  }

  verificarCorreo(){
    this.emailVrf.currentUser.then(user => user?.sendEmailVerification())
                             .then(() => {
                              console.log("Enviado Correo")
                              this.route.navigate(['/login'])
                             })
  }
}
