import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';
import {  AlertController } from 'ionic-angular';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  captureDataUrl: string;
  alertCtrl: AlertController;
  constructor(public navCtrl: NavController,private camera:Camera, alertCtrl: AlertController) {
    this.alertCtrl = alertCtrl;
  }
  capture() {
    //setup camera options
    const cameraOptions: CameraOptions = {
      quality: 50,

      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
   this.camera.getPicture(cameraOptions).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }
  upload() {
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);

    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`images/${filename}.jpg`);

    imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
      this.showSuccesfulUploadAlert();
     // Do something here when the data is succesfully uploaded!
    });

  }
  showSuccesfulUploadAlert() {
    let alert = this.alertCtrl.create({
      title: 'Uploaded!',
      subTitle: 'Picture is uploaded to Firebase',
      buttons: ['OK']
    });
    alert.present();

    // clear the previous photo data in the variable
    this.captureDataUrl = "";
  }
}
