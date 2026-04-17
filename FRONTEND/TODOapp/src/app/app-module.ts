import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
// Importe o provideHttpClient e o withFetch
import { provideHttpClient, withFetch } from '@angular/common/http';

import { App } from './app';
import { Item } from './item/item';

@NgModule({
  declarations: [App, Item],
  imports: [
    BrowserModule
    // Remova o HttpClientModule daqui para evitar conflitos
  ],
  providers: [
    provideBrowserGlobalErrorListeners(), 
    provideClientHydration(withEventReplay()),
    // Adicione o provider do HttpClient com Fetch aqui
    provideHttpClient(withFetch())
  ],
  bootstrap: [App],
})
export class AppModule {}