import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

const GYPHY_APY_KEY = 'W2s1i9ozrANuWKuFvm3W7bt9Z9hMEtmM';
const serviceUrl = 'https://api.giphy.com/v1/gifs';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  constructor(private http: HttpClient){
    this.loadLocalStorage();
  }


  private _tagsHistory: string[] = [];
  public gifList: Gif[] = [];




  get tagsHistory() {
    return [...this._tagsHistory]; //el spread para que sea copia y no se arruine al cambiar dato en la variable
  }

  private organizeHistory (tag: string){
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter(oldtag => oldtag !== tag);
    }

    if(this.tagsHistory.length >= 10) this._tagsHistory.splice(this.tagsHistory.length-1,1);
    this._tagsHistory.unshift(tag);
    this.saveLocalStorage();

  }

  private saveLocalStorage():void{
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage():void{
    if(!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if(this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);

  }
  public searchTag (tag: string) : void {

    if (tag.length === 0) return;
    this.organizeHistory(tag);
    //  console.log( this.tagsHistory );
    const params = new HttpParams()
    .set('api_key', GYPHY_APY_KEY)
    .set('limit', 10)
    .set('q', tag)

    this.http.get<SearchResponse>(`${serviceUrl}/search`,{params})
    .subscribe( resp => {
      this.gifList = resp.data;
    });

  }


}
