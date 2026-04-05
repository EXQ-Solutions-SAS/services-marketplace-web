import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidenav } from '../components/sidenav';
import { Header } from '../components/header';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, Sidenav, Header],
  template: `
    <div class="flex h-screen bg-[#070a0f] text-slate-200">
      <app-sidenav />
      
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        
        <main class="flex-1 overflow-y-auto p-8">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class AdminLayout {}