import { trigger, transition, query, style, group, animate } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonTabs } from '@ionic/angular';
import { subscribeOn } from 'rxjs';
import { UiService } from '../services/ui.service';
import { UtilService } from '../services/util.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  public title: string;


  @ViewChild(IonTabs, { static: false }) tabs: IonTabs;

  zonasAnalisisCompleted: boolean = true;
  comportamientoFuegoCompleted: boolean = true;
  costesCompleted: boolean = true;

  constructor( private router: Router, private util: UtilService, public uiService: UiService) { }

  ngOnInit() {
    this.title = this.router.url;

    this.uiService.getSelectTab().subscribe(title =>{
      this.tabs.select(title);
    });
  }
}
