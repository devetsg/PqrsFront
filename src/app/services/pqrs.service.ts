import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class PqrsService {
  myApiUrl = environment.endpoint;
  myAppUrlP = "api/eureka/"
  myAppUrlPr = "api/principal/"
  myAppUrlSc = "api/secundary/"
  myAppUrlTy = "api/types/"
  myAppUrlMe = "api/means/"
  myAppUrlIn = "api/Inbox/"
  myAppUrlS = 'api/Sender/';
  myAppUrlM = 'api/Mail/';

  constructor(private _http: HttpClient, private _serviceA:AccountService) { }

  //MAILS COPY
  getMailCopy(id: number): Observable<any> {
    let path = `${this.myApiUrl}${this.myAppUrlM}getMailCopy/${id}`;
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);

    return this._http.get(path, { headers });
  }

  getMailsCopy(): Observable<any> {
    let path = `${this.myApiUrl}${this.myAppUrlM}getMailsCopy`;
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);

    return this._http.get(path, { headers });
  }

  createUpdateMailCopy(data:FormData,id?:number):Observable<any>{
    let path = `${this.myApiUrl}${this.myAppUrlM}createUpdateMail`;
    if (id != undefined || id != null) {
      path += `/${id}`
    }
    let jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Autorization','Bearer '+ jwt);

    return this._http.post(path,data,{headers});
  }

  deleteMailCopy(id:number):Observable<any>{
    let path = `${this.myApiUrl}${this.myAppUrlM}deleteMail/${id}`;
    let jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Autorization','Bearer ' + jwt);

    return this._http.delete(path,{headers});
  }

  //SENDERS
  getSenders(id?: number): Observable<any> {
    let path = `${this.myApiUrl}${this.myAppUrlS}getSenders`;
    if (id != undefined || id != null) {
      path += `/${id}`
    }

    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);

    return this._http.get(path, { headers });
  }

  getFilteredSenders(data: FormData) {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);

    return this._http.post(`${this.myApiUrl}${this.myAppUrlS}senderFilter`, data, { headers })
  }

  //sendEmail(data: FormData): Observable<any> {
  //  var jwt = this._serviceA.getJWT();
  //  let headers = new HttpHeaders();
  //  headers = headers.set('Authorization', 'Bearer ' + jwt);

  //  return this._http.post(`${this.myAppUrl}${this.myApiUrlS}sendEmail`, data, { headers });
  //}

  postSender(id?: number, data?: FormData): Observable<any> {
    let path = `${this.myApiUrl}${this.myAppUrlS}postSender`;
    if (id != undefined || id != null) {
      path += `/${id}`
    }

    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);

    return this._http.post(path, data, { headers });
  }

  deleteSender(id: number): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);

    return this._http.delete(`${this.myApiUrl}${this.myAppUrlS}deleteSender/${id}`, { headers });
  }

  //INBOX
  getMails(data:FormData): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlIn}getMails`,data,{headers});
  }

  sendEmail(data: FormData): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlIn}sendEmail`, data,{headers});
  }
  //EUREKA

  getPqr(id: number):Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getPqr/${id}`,{headers});
  }

  getHistoryMiner(id: number):Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getHistoryMiner/${id}`,{headers});
  }

  getHistoryResponse(id: number):Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getHistoryResponse/${id}`,{headers});
  }

  getPqrs(): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getPqrsDir`,{headers});
  }

  getPqrsByEdit(): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getPqrsByEdit`,{headers});
  }

  changeStatusView(id: number, status: number): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    
    // Modificar la URL para incluir 'status'
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}changeStatusView/${id}/${status}`, { headers });
  }
  
  changeStatusEdit(id: number, status: number): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    
    // Modificar la URL para incluir 'status'
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}changeStatusEdit/${id}/${status}`, { headers });
  }

  getPqrsSend(): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getPqrsSend`,{headers});
  }

  getPqrsMiner(): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getPqrsMiner`,{headers});
  }

  getPqrsCoord(): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getPqrsCoord`,{headers});
  }

  getPqrsGestion(): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getPqrsGestion`,{headers});
  }

  getPqrsContralor(): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getPqrsContralor`,{headers});
  }

  getFullPqrs(): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getFullPqrs`,{headers});

  }

  getServicesPqr(id: number): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getServicesPqr/${id}`,{headers});

  }

  checkServices(id:number): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}checkServices/${id}`,{headers});
  }

  getAttach(data:FormData): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlP}getAttach`, data, { responseType: 'blob',headers });
  }

  getFile(data: FormData): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlP}getFile`, data,{headers}/*, { responseType: 'blob'  }*/);
  }

  getRegionals() {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getRegionals`,{headers});

  }

  createPqr(data: FormData): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlP}createPqr`, data,{headers});
  }

  downloadFullHistory(data: FormData): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlP}getFullHistory`, data,{headers , responseType: 'blob'  });
  }

  updatePqr(data: FormData,id:number): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlP}createPqr/${id}`, data,{headers});
  }

  deletePqr(id: number): Observable<any>{
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.delete(`${this.myApiUrl}${this.myAppUrlP}deletePqr/${id}`,{headers});

  }

  PostPQR(data:FormData):Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlP}postData`, data,{headers});
  }

  GetAudio(id: number) {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getAudio/${id}`,
      { responseType: 'blob',headers})
  }

  GetDocu(): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getDocumentType`,{headers});
  }

  GetDetails(id: number):Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getDetails/${id}`,{headers});
  }

  GetInfoUser(data: FormData): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlP}getInfoUser`, data,{headers});
  }

  GetUsers(): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getUsers`,{headers});
  }

  GetClient(document:string): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getClient?document=${document}`,{headers});
  }

  GetHistory(id: number): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getHistory/${id}`,{headers});

  }

  ExcelToJson(data: FormData): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlP}excelToJson`, data,{headers});
  }

  FinishPqr(data: FormData): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlP}finishPqr`, data,{headers});
  }

  deleteRelation(id: number): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.delete(`${this.myApiUrl}${this.myAppUrlP}deleteRelation/${id}`,{headers});
  }

  addSignature(data: FormData): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlP}addSignature`, data,{headers});
  }

  downloadZip(id: number): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getZipResponse/${id}`, { responseType: 'blob',headers });

  }

  downloadZip2(id: number): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getZipResponse2/${id}`, { responseType: 'blob',headers });

  }

  getMiners():Observable<any>{
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}GetMiners`,{headers});
  }

  addDataMiner(data:FormData):Observable<any>{
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlP}addDataMiner`, data , {headers})
  }

  sendToMiner(data:FormData):Observable<any>{
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlP}changeStatusMiner`,data,{headers});
  }

  exitMiner(id:number){
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}changeStatusCreated/${id}`,{headers});
  }

  messageMinersTs(){
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}messageMinersTs`,{headers});
  }

  messageMinersOp(){
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}messageMinersOp`,{headers});

  }

  getInterval() :Observable<any>{
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getInterval`, {headers})
  }

  updateInterval(interval:number):Observable<any>{
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.put(`${this.myApiUrl}${this.myAppUrlP}updateInterval?newInterval=${interval}`, {headers})
  }

  //TYPES

  getType(id: number):Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlTy}getType/${id}`,{headers})
  }

  getTypes(): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlTy}getTypes/`,{headers})
  }

  createType(data: FormData): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlTy}createType/`,data,{headers})
  }

  updateType(id:number,data: FormData): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlTy}updateType/${id}`, data,{headers})
  }

  deleteType(id: number): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.delete(`${this.myApiUrl}${this.myAppUrlTy}deleteType/${id}`,{headers})
  }

  //SECUNDARY

  getSecundary(id: number): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlSc}getSecundary/${id}`,{headers})
  }

  getSecundaries(): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlSc}getSecundaries/`,{headers})
  }

  createSecundary(data:FormData): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlSc}createSecundary/`, data,{headers})
  }

  updateSecundary(id:number,data: FormData): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);

    return this._http.post(`${this.myApiUrl}${this.myAppUrlSc}updateSecundary/${id}`, data,{headers})
  }

  deleteSecundary(id: number): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);

    return this._http.delete(`${this.myApiUrl}${this.myAppUrlSc}deleteSecundary/${id}`,{headers})
  }

  //PRINCIPAL

  getPrincipal(id: number): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);

    return this._http.get(`${this.myApiUrl}${this.myAppUrlPr}getPrincipal/${id}`,{headers})
  }

  getPrincipals(): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlPr}getPrincipals/`,{headers})
  }

  createPrincipal(data: FormData): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlPr}createPrincipal/`, data,{headers})
  }

  updatePrincipal(id:number,data: FormData): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlPr}updatePrincipal/${id}`, data,{headers})
  }

  deletePrincipal(id: number): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.delete(`${this.myApiUrl}${this.myAppUrlPr}deletePrincipal/${id}`,{headers})
  }

  //MEANS RADICATION

  getMean(id: number): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlMe}getMean/${id}`,{headers})
  }

  getMeans(): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlMe}getMeans/`,{headers})
  }

  createMean(data: FormData): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlMe}createMean/`, data ,{headers})
  }

  updateMean(id: number, data: FormData): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlMe}updateMean/${id}`, data ,{headers})
  }

  deleteMean(id: number): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.delete(`${this.myApiUrl}${this.myAppUrlMe}deleteMean/${id}`,{headers})
  }


  // RESPONSE
  responseToDir(data: FormData): Observable<any> {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlP}reponseToDir`, data, {headers})
  }

  sendFollow(data: FormData) {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.post(`${this.myApiUrl}${this.myAppUrlP}reponseFinish`, data, {headers})
  }


  // CHAT
  getChat(id:number) {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}getChat/${id}`,{headers})

  }

  //SIGNATURE
  getSignature() {
    var jwt = this._serviceA.getJWT();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this._http.get(`${this.myApiUrl}${this.myAppUrlP}withSignature`,{headers})

  }
}




