import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { authenticatedGuard } from './core/guards/authenticated.guard';

export const routes: Routes = [
    {
        path:"",
        loadComponent: ()=> import("./shared/components/layout/layout.component"),
        children:[
            {
                path:"inicio",
                loadComponent: ()=> import("./business/components/inicio/inicio.component")
            },
            {
                path:"sobrenosotros",
                loadComponent: ()=> import("./business/components/inicio/inicio.component")
            },
            {
                path:"contacto",
                loadComponent: ()=> import("./business/components/inicio/inicio.component")
            },
            {
                path:"info",
                loadComponent: ()=> import("./business/components/inicio/inicio.component")
            },
            {
                path:"",
                redirectTo:'inicio',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: "login",
        loadComponent: ()=> import("./business/components/auth/login/login.component"),
        canActivate: [authenticatedGuard]
    },
    {
        path: "dashboard",
        loadComponent: ()=> import("./business/components/dashboard/dashboard.component"),
        canActivate: [authGuard],
        children:[
            {
                path: "lista-alumnos",
                loadComponent: ()=> import("./business/components/alumnos-tabla/alumnos-tabla.component")
            },
            {
                path: "registrar-asistencias",
                loadComponent: ()=> import("./business/components/registro-asistencia/registro-asistencia.component")
            },
            {
                path: "lista-asistencias",
                loadComponent: ()=> import("./business/components/asistencias-tabla/asistencias-tabla.component")
            },
            {
                path: "panel-administrador",
                loadComponent: ()=> import("./business/components/opciones-administrador/opciones-administrador.component")
            },
            {
                path: "interesados-matricula",
                loadComponent: ()=> import("./business/components/interesados-tabla/interesados-tabla.component")
            },
            {
                path: "crear-alumno",
                loadComponent: ()=> import("./business/components/crear-alumno/crear-alumno.component")
            },
            {
                path: "lista-alumnos/:id",
                loadComponent: ()=> import("./business/components/detalle-alumno/detalle-alumno.component")
            },
            {
                path:"",
                redirectTo:'panel-administrador',
                pathMatch: 'full'
            }

        ]
    },
    {
        path: '**',
        redirectTo: "inicio"
    }
];
