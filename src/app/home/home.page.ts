import { AfterViewInit, Component } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import * as JsBarcode from "JsBarcode";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  constructor(private fb: NonNullableFormBuilder, private scanner: BarcodeScanner, private alertController: AlertController) {
    this.platform = Capacitor.getPlatform()

    console.log(this.obj.birth);
    
  }

  ngAfterViewInit(): void {
    // this.generateBarcode();
  }

  platform: string
  formData: string = "test";
  obj = {
    name: 'Jona',
    birth: Date.now()
  }


  CheckinForm = this.fb.group({

  })

  async scan(){    
    if (this.platform !== 'web') {
      try {
        const scanResults = await this.scanner.scan()
        console.log(scanResults);
        
        
      } catch (error) {
        console.log(error);
        throw error
      }      
    } else {
      this.showError('Scanning is not supported on this platform.')
    }   

  }

  async generateBarcode(){
    const canvas = document.createElement('canvas')
    JsBarcode(canvas, 'test', {
      format: 'CODE128',      
    }) 
    // Convert the canvas to a Uint8Array
    // const uint8Array = this.canvasToUint8Array(canvas);

    // Log the Uint8Array (you can use it as needed)
    // console.log(uint8Array);

    canvas.toBlob((blob) => {
      if (blob) {
        this.printBarcode(blob);        
      }
      else{
        console.warn('barcode gen failed')
      }
    })
  }

  printBarcode(blob: Blob): void {
    // Create a URL for the Blob
    const blobUrl = URL.createObjectURL(blob);

    // Open the Blob in a new window (you might want to adjust the window options)
    const printWindow = window.open(blobUrl, '_blank');

    // Optionally, you can revoke the object URL after it's no longer needed
    // URL.revokeObjectURL(blobUrl);
  }
  
  canvasToUint8Array(canvas: HTMLCanvasElement): Uint8Array {
    // Get the image data from the canvas
    const imageData = canvas.toDataURL('image/png').replace(/^data:image\/\w+;base64,/, '');
    const binaryString = atob(imageData);
    const length = binaryString.length;
    const uint8Array = new Uint8Array(length);

    // Populate the Uint8Array with binary data
    for (let i = 0; i < length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    return uint8Array;
  }

  // async encode(){
  //   try {
  //     const code = await this.scanner.encode(this.scanner.Encode.TEXT_TYPE, {name: 'Seth', email: 'test@snhd.org', department: 'it'})
  //     console.log(code);
      
  //   } catch (error) {
      
  //   }
  // }

  async setQRData(){
    this.formData = "hehehehehe"
  }
  async encode(parent: any){
    await this.setQRData();
    console.log(parent);
    console.log(parent.qrcElement);
    
    setTimeout(() => {
      let parentElement = parent.qrcElement?.nativeElement?.querySelector("canvas").toDataURL("image/png")
      console.log(parentElement);
      if(parentElement){
          // Split the data URL to extract the base64 string
        let base64String = parentElement.split(',')[1];
  
        // Now 'base64String' contains the base64 representation of the image
        console.log(base64String);
        
      }

    }, 200)

    
    // try {
    //   const code = await this.scanner.encode(this.scanner.Encode.TEXT_TYPE, {name: 'Seth', email: 'test@snhd.org', department: 'it'})
    //   console.log(code);
      
    // } catch (error) {
      
    // }
  }
  
  async showError(message: string){
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      backdropDismiss: false,
      buttons: ['OK']
    });

    await alert.present();
  }



}
