import { Component, Input, OnInit } from '@angular/core';

export class IBreadCrumb {
  label: string;
  imagePath: string;
  url: string;
}


@Component({ 
	selector: 'breadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
	@Input() 
	imagePath: string;

	@Input() 
	title: string;

	constructor() {
		
	}

	ngOnInit() {
		
	}
}