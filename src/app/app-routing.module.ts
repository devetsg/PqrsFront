import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { IndexPqrsComponent } from './components/index-pqrs/index-pqrs.component';
import { CreateUpdatePqrComponent } from './components/create-update-pqr/create-update-pqr.component';
import { HistoryComponent } from './components/history/history.component';
import { AddServicesComponent } from './components/add-services/add-services.component';
import { IndexMeansComponent } from './components/index-means/index-means.component';
import { CreateUpdateMeansComponent } from './components/create-update-means/create-update-means.component';
import { IndexPrincipalComponent } from './components/index-principal/index-principal.component';
import { CreateUpdatePrincipalComponent } from './components/create-update-principal/create-update-principal.component';
import { CreateUpdateSecundaryComponent } from './components/create-update-secundary/create-update-secundary.component';
import { IndexSecundaryComponent } from './components/index-secundary/index-secundary.component';
import { IndexTypesComponent } from './components/index-types/index-types.component';
import { CreateUpdateTypesComponent } from './components/create-update-types/create-update-types.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { LoginComponent } from './components/login/login.component';
import { ResponsePqrComponent } from './components/response-pqr/response-pqr.component';
import { IndexDirComponent } from './components/index-dir/index-dir.component';
import { AprovedDirComponent } from './components/aproved-dir/aproved-dir.component';
import { IndexSenderComponent } from './components/index-sender/index-sender.component';
import { CreateUpdateSenderComponent } from './components/create-update-sender/create-update-sender.component';
import { SignatureComponent } from './components/signature/signature.component';
import { supervisorGuard } from './guards/general.guard';
import { IndexSendComponent } from './components/index-send/index-send.component';
import { IndexMinerComponent } from './components/index-miner/index-miner.component';
import { IndexCoorComponent } from './components/index-coor/index-coor.component';
import { AddDataMinedComponent } from './components/add-data-mined/add-data-mined.component';
import { SupervisorComponent } from './components/supervisor/supervisor.component';
import { ShowMinerComponent } from './components/show-miner/show-miner.component';
import { TestsComponent } from './components/tests/tests.component';




const routes: Routes = [
  { path: "" , component: LoginComponent},
  { path: "login", component: LoginComponent },
  {
    path: "indexPqrs",
    component: IndexPqrsComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'ANALISTA,SUPERUSER'}
  },
  {
    path: "responsePqr/:id",
    component: ResponsePqrComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'ANALISTA,DIRGENERAL,MINERO,COORDINADOR,SUPERUSER' }
  },
  {
    path: "aprovedDir/:id",
    component: AprovedDirComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'ANALISTA,DIRGENERAL,SUPERUSER' }
  },
  {
    path: "createUpdatePqr",
    component: CreateUpdatePqrComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'ANALISTA,SUPERUSER' }
  },
  {
    path: "createUpdatePqr/:id",
    component: CreateUpdatePqrComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'ANALISTA,SUPERUSER' }
  },
  {
    path: "indexMeans",
    component: IndexMeansComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'COORDINADOR,SUPERUSER' }
  },
  {
    path: "createUpdateMean",
    component: CreateUpdateMeansComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'COORDINADOR,SUPERUSER' }
  },
  {
    path: "createUpdateMean/:id",
    component: CreateUpdateMeansComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'COORDINADOR,SUPERUSER' }
  },
  {
    path: "indexPrincipals",
    component: IndexPrincipalComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'COORDINADOR,SUPERUSER' }
  },
  {
    path: "createUpdatePrincipal",
    component: CreateUpdatePrincipalComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'COORDINADOR,SUPERUSER' }
  },
  {
    path: "createUpdatePrincipal/:id",
    component: CreateUpdatePrincipalComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'COORDINADOR,SUPERUSER' }
  },
  {
    path: "indexSecundaries",
    component: IndexSecundaryComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'COORDINADOR,SUPERUSER' }
  },
  {
    path: "createUpdateSecundary",
    component: CreateUpdateSecundaryComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'COORDINADOR,SUPERUSER' }
  },
  {
    path: "createUpdateSecundary/:id",
    component: CreateUpdateSecundaryComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'COORDINADOR,SUPERUSER' }
  },
  {
    path: "indexTypes",
    component: IndexTypesComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'COORDINADOR,SUPERUSER' }
  },
  {
    path: "createUpdateType",
    component: CreateUpdateTypesComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'COORDINADOR,SUPERUSER' }
  },
  {
    path: "createUpdateType/:id",
    component: CreateUpdateTypesComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'COORDINADOR,SUPERUSER' }
  },
  {
    path: "addServices/:id",
    component: AddServicesComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'ANALISTA,SUPERUSER' }
  },
  {
    path: "inbox",
    component: InboxComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'ANALISTA,SUPERUSER' }
  },
  {
    path: "indexDir",
    component: IndexDirComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'ANALISTA,DIRGENERAL,SUPERUSER' }
  },
  {
    path: "indexSenders",
    component: IndexSenderComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'COORDINADOR,SUPERUSER' }
  },
  {
    path: "createUpdateSender",
    component: CreateUpdateSenderComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'COORDINADOR,SUPERUSER' }
  },
  {
    path: "createUpdateSender/:id",
    component: CreateUpdateSenderComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'COORDINADOR,SUPERUSER' }
  },
  {
    path: "signatures",
    component: SignatureComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'COORDINADOR,SUPERUSER' }
  },
  {
    path: "indexSend",
    component: IndexSendComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'DIRGENERAL,ANALISTA,SUPERUSER,COORDINADOR' }
  },
  {
    path: "indexMiner",
    component: IndexMinerComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'MINERO,SUPERUSER' }
  },
  {
    path: "indexCoord",
    component: IndexCoorComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'COORDINADOR,SUPERUSER' }
  },
  {
    path: "indexSupervisor",
    component: SupervisorComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'SUPERVISOR,SUPERUSER' }
  },
  {
    path: "showMiner",
    component: ShowMinerComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'SUPERVISOR,SUPERUSER' }
  },
  {
    path: "tests",
    component: TestsComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [supervisorGuard],
    data: { expectedRoleSuper: 'SUPERVISOR,SUPERUSER' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
