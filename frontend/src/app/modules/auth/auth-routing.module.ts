import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuccesMessageComponent } from './succes-message/succes-message.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
    {
        path: '',
        component: RegisterComponent,
    },
    {
        path: 'succes',
        component: SuccesMessageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }