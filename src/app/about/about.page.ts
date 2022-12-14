import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { AppService } from '../services/app.service';
import { UiService } from '../services/ui.service';
import { IonContent } from '@ionic/angular';


@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit, AfterViewInit {

  title: string = "Créditos";
  imagePath: string = "./assets/img/question.png";

  @ViewChild("content", { static: false })
  content: IonContent;

  constructor(private location: Location, private uiService: UiService) { }
  
  ngAfterViewInit(): void {
    this.uiService.getTopScrolled$().subscribe(scrolled => {
      this.content.scrollToTop();
    });

  }

  ionViewWillEnter(){
  
  }

  ngOnInit() {
   
  }

  goPrev() {
    this.location.back();
  }

}
