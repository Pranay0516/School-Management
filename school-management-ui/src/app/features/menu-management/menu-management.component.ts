import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface Menu{title:string;access:string[]}
@Component({selector:'app-menu-management',standalone:true,imports:[FormsModule],templateUrl: './menu-management.component.html',
  styleUrl: './menu-management.component.scss',
}) export class MenuManagementComponent {roles=['ADMIN','TEACHER','STUDENT','PARENT'];newMenu='';menus=signal<Menu[]>([{title:'Dashboard',access:['ADMIN','TEACHER','STUDENT','PARENT']},{title:'Students',access:['ADMIN','TEACHER']},{title:'Attendance',access:['ADMIN','TEACHER','STUDENT','PARENT']},{title:'Examinations',access:['ADMIN','TEACHER','STUDENT','PARENT']},{title:'Question Papers',access:['ADMIN','TEACHER']},{title:'Fees',access:['ADMIN','STUDENT','PARENT']}]);add(){if(this.newMenu.trim())this.menus.update(x=>[...x,{title:this.newMenu.trim(),access:['ADMIN']}]);this.newMenu=''}toggle(menu:Menu,role:string){this.menus.update(x=>x.map(m=>m!==menu?m:{...m,access:m.access.includes(role)?m.access.filter(a=>a!==role):[...m.access,role]}))}}
