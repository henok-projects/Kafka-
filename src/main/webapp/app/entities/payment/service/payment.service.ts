import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPayment, getPaymentIdentifier } from '../payment.model';
import { IHostedPayment } from '../hostedpayment.model';

export type EntityResponseType = HttpResponse<IPayment>;
export type EntityArrayResponseType = HttpResponse<IPayment[]>;

@Injectable({ providedIn: 'root' })
export class PaymentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/payment');
  protected hostedPaymentUrl = this.applicationConfigService.getEndpointFor('api/paymentSB');
  protected paymentAmout = this.applicationConfigService.getEndpointFor('api/amountOfMoney');
  protected ppToken = this.applicationConfigService.getEndpointFor('api/paypal');
  protected EC = this.applicationConfigService.getEndpointFor('api/paypalGetEC');
  protected doEC = this.applicationConfigService.getEndpointFor('api/paypalDoEC');
  protected kafkadmin = this.applicationConfigService.getEndpointFor('api/kafkadmin');
  protected kafka = this.applicationConfigService.getEndpointFor('api/kafka');
  protected sendemail = this.applicationConfigService.getEndpointFor('api/sendemail');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(payment: IPayment): Observable<EntityResponseType> {
    return this.http.post<IPayment>(this.resourceUrl, payment, { observe: 'response' });
  }
  getPpToken(payment: IPayment): any {
    return this.http.post<any>(`${this.ppToken}`, payment, { observe: 'response' });
  }
  kafkaQueue(payment: IPayment): Observable<EntityResponseType> {
    return this.http.post<IPayment>(this.kafka, payment, { observe: 'response' });
  }

  kafkaAdmin(): Observable<IPayment[]> {
    return this.http.get<IPayment[]>(this.kafkadmin);
  }

  getSendemail(payment: IPayment): Observable<EntityResponseType> {
    return this.http.post<IPayment>(this.sendemail, payment, { observe: 'response' });
  }
  // getSendemail(): any {
  //   return this.http.get<any>(`${this.sendemail}`, { observe: 'response' });
  // }

  getEC(): any {
    return this.http.get<any>(`${this.EC}`, { observe: 'response' });
  }

  getDoEC(): any {
    return this.http.get<any>(`${this.doEC}`, { observe: 'response' });
  }

  update(payment: IPayment): Observable<EntityResponseType> {
    return this.http.put<IPayment>(`${this.resourceUrl}/${getPaymentIdentifier(payment) as number}`, payment, { observe: 'response' });
  }

  partialUpdate(payment: IPayment): Observable<EntityResponseType> {
    return this.http.patch<IPayment>(`${this.resourceUrl}/${getPaymentIdentifier(payment) as number}`, payment, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPayment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<string>> {
    const options = createRequestOption(req);
    return this.http.get<string>(this.resourceUrl, { params: options, observe: 'response' });
  }
  queryData(req?: any): Observable<HttpResponse<IPayment[]>> {
    const options = createRequestOption(req);
    return this.http.get<IPayment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
  getHostedPayment(): any {
    return this.http.get<IHostedPayment>(`${this.hostedPaymentUrl}`, { observe: 'response' });
  }

  getPayment(payment: IPayment): Observable<EntityResponseType> {
    return this.http.post<IPayment>(this.paymentAmout, payment, { observe: 'response' });
  }
  getTransactionId(req?: any): Observable<HttpResponse<string>> {
    const options = createRequestOption(req);
    return this.http.get<string>(`${this.resourceUrl}/mockbin`, { params: options, observe: 'response' });
  }

  addPaymentToCollectionIfMissing(paymentCollection: IPayment[], ...paymentsToCheck: (IPayment | null | undefined)[]): IPayment[] {
    const payments: IPayment[] = paymentsToCheck.filter(isPresent);
    if (payments.length > 0) {
      const paymentCollectionIdentifiers = paymentCollection.map(paymentItem => getPaymentIdentifier(paymentItem)!);
      const paymentsToAdd = payments.filter(paymentItem => {
        const paymentIdentifier = getPaymentIdentifier(paymentItem);
        if (paymentIdentifier == null || paymentCollectionIdentifiers.includes(paymentIdentifier)) {
          return false;
        }
        paymentCollectionIdentifiers.push(paymentIdentifier);
        return true;
      });
      return [...paymentsToAdd, ...paymentCollection];
    }
    return paymentCollection;
  }
}
