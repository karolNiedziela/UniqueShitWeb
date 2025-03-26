import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-webapi',
  imports: [],
  templateUrl: './webapi.component.html',
  styleUrl: './webapi.component.scss',
})
export class WebapiComponent {
  endpoint: string = `${environment.apiUrl}/sizes?productCategoryId=1`;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getSizes();
  }

  getSizes() {
    this.http.get(this.endpoint).subscribe((sizes) => {
      console.log(sizes);
    });
  }
}
