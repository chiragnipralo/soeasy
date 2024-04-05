import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController,AlertController, PopoverController, IonSlides, IonPopover, NavController } from '@ionic/angular';
import { ChatPage } from '../../pages/chat/chat.page';
import { MapActivityPage } from 'src/app/events/map-activity/map-activity.page';
import { CommonService } from '../../services/common.service';
import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';
import { Share } from '@capacitor/share';
import { Router,ActivatedRoute, NavigationExtras } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { CommunityMemberPage } from '../community-member/community-member.page';
import { ImageModalComponent } from 'src/app/components/image-modal/image-modal.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-community-details',
  templateUrl: './community-details.page.html',
  styleUrls: ['./community-details.page.scss'],
})
  
export class CommunityDetailsPage implements OnInit {

  events_data=[];
  filterData = [];
  public premium!: number;
  count :number =0;
  is_user_joining:boolean=false;
  fileName: string = '';
  fileAdminName: string = '';
  showMsg:any;
  senderMsg:any;
  selectedFile: File | undefined;
  selectedAdminFile: File | null = null;
  jData = [];
  cData:any;
  messages: any[] = [];
  message: string = '';
  selectedFileName: string = '';
  messageStates: any[] = [];
  pressTimeout: any;
  clickCount: number = 0;
  segment = 0;
  public eventCount!: number;

  constructor(private alertController: AlertController,
    public sanitizer: DomSanitizer,
    public commonservice:CommonService,
    public dataservice: DataService,  
    public modalController: ModalController,
    public popoverController: PopoverController,
    private _route: ActivatedRoute,
    public mapmodal: ModalController,
    public chatconnect: HttpService,
    private _router: Router,
    private navCtrl: NavController,
    private router: Router,
    private datePipe: DatePipe,
    private location: Location) {
  }

  goBack(){
    this.navCtrl.pop();
  }
  
  @ViewChild('slider', { static: true })
  private slider!: IonSlides;

  @ViewChild('popover')
  popover!: IonPopover;
  isOpen = false;

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  onPopoverDismiss() {
    this.isOpen = false;
  }

  async segmentChanged() {
    await this.slider.slideTo(this.segment);
  }

  slideChanged() {
    this.slider.getActiveIndex().then(index => {     
      this.segment = index;
    });
  }
  
  doRefresh(refresher: { target: { complete: () => void; }; }) {
    this.ionViewDidEnter();
    setTimeout(() => {
      refresher.target.complete();
    }, 2000);
  }

  ngOnInit() {
    if (this.dataservice?.user_community_data?.admin_post) {
      this.messageStates = this.dataservice.user_community_data.admin_post.map(() => ({
        showOptions: false,
      }));
    }
  }

  ionViewDidEnter(){
    console.log("ionViewDidEnter")
    this.All_community();
    this.All_events();
  }

  async openModal(originalEventImages: string[]) {
    const modal = await this.modalController.create({
      component: ImageModalComponent,
      componentProps: {
        originalEventImages: originalEventImages
      }
    });
    return await modal.present();
  }

  toggleMessageOptions(index: number) {
    //this.messageStates[index].showOptions = !this.messageStates[index].showOptions;
  }

  async Viewmember(){
    this.dataservice.community_member = this.dataservice?.user_community_data;
    this.dataservice.is_premium = 0;
    this.dataservice.community_type = 1;
    const modal = await this.modalController.create({
      component: CommunityMemberPage,
      cssClass: 'pindialog-container',
      handle: true,
      componentProps: { 
        is_modal: true
      },
    });
    modal.onDidDismiss().then((data:any) => {
    });
    return await modal.present();
  }

  async Event_chats(){
    const modal = await this.modalController.create({
      component: ChatPage,
      cssClass: 'pindialog-container',
      handle: true,
      componentProps: { 
        pass_code: true
      },
    });
    modal.onDidDismiss().then((data:any) => {
      console.log("DATA HERE --->",data)
      if(data.data!= undefined){

      }
    });
    return await modal.present();
  }

  async Share_Event(){
    await Share.share({
      title: 'Commmunity Link',
      text: 'Join!!',
      url: this.dataservice?.user_community_data.community_url,
      dialogTitle: 'Share with buddies',
    });
  }

  delete_community(){
    const popover = document.querySelector('ion-popover') as HTMLIonPopoverElement | null;
    if (popover) {
      this.router.navigate(['/community-delete']);
      popover.dismiss();
    }
  }

  async leave_community() {
    const popover = document.querySelector('ion-popover') as HTMLIonPopoverElement | null;
    if (popover) {
      const alert = await this.alertController.create({
        header: 'Confirm',
        message: 'Are you sure you want to Leave this community?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Yes',
            handler: () => {                    
              let apidata = {
                user_token: this.dataservice.getUserData(),
                community_id:  this.dataservice.user_community_data.id,
                premium: 0,
              }
              this.chatconnect.postData(apidata, "exit_community").then((result: any) => {
                if (result.Response.status == 1) {
                  this._router.navigate(['tabs/dashboard'])
                  this.commonservice.presentToast("", result.Response.message);
                } else {
                  this.commonservice.presentToast("Oops", result.Response.message)
                }
              }, (err) => {
                console.log("Connection failed Messge");
              });
            }
          }
        ],
      });
      await alert.present();
      popover.dismiss();
    }
  }

  create_events(){
    const popover = document.querySelector('ion-popover') as HTMLIonPopoverElement | null;
    if (popover) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          value1: 2,
          value2: this.dataservice.user_community_data.id
        }
      };
    
      this._router.navigate(['events/create'], navigationExtras);
      popover.dismiss();
    }
  }

  edit_community() {
    const popover = document.querySelector('ion-popover') as HTMLIonPopoverElement | null;
    if (popover) {
      this.dataservice.user_community_data = this.dataservice.user_community_data;
      this._router.navigate(['/edit-community'])
      popover.dismiss();
    }
  }

  community_events() {
    const popover = document.querySelector('ion-popover') as HTMLIonPopoverElement | null;
    if (popover) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          value: 0
        }
      };
      this.dataservice.user_community_data = this.dataservice.user_community_data;
      this._router.navigate(['/community-event'], navigationExtras)
      popover.dismiss();
    }
  }

  community_post(){
    const popover = document.querySelector('ion-popover') as HTMLIonPopoverElement | null;
    if (popover) {
      this.router.navigate(['/community-post']);
      popover.dismiss();
    }
  }

  All_community() {  
    // this.commonservice.show();
    let apidata = {
      premium: 0,
      user_token: this.dataservice.getUserData(),
      type:this.dataservice.user_community_data.account_type,
      community_id:this.dataservice.user_community_data.id
    }
    this.chatconnect.postData(apidata,"view_community_by_id").then((result:any)=>{
      // this.commonservice.hide();
      if(result.Response.status ==1){
        this.dataservice.setCommunityData(result.Response.community_data);
      }else{
        this.commonservice.presentToast("Oops",result.Response.message)
      }
    },(err)=>{ 
      console.log("Connection failed Messge");
    });    
  }

  join_community() {
    let apidata={
      user_token:this.dataservice.getUserData(),
      community_id: this.dataservice.user_community_data.id,
      premium:0
    }
    this.chatconnect.postData(apidata,"join_community").then((result:any)=>{
      if(result.Response.status == 1){
        this.modalController.dismiss();
        this.commonservice.presentToast("","Joined Successfully")
        this.ionViewDidEnter();
        // this.location.back();
      }else{
        this.commonservice.presentToast("Oops",result.Response.message)
      }
    },(err)=>{ 
      console.log("Connection failed Messge");
    });
  }

  onFileSelectedAdminPost(event: any) {
    this.selectedAdminFile = event.target.files[0];
    this.fileAdminName = this.selectedAdminFile?.name || '';
  }

  onFileSelected(event: any) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = event.target.files[0];
  
      if (this.selectedFile) {
        this.fileName = this.selectedFile.name;
        this.selectedFileName = fileInput.files[0].name;
      }
    }
  }

  adminPost() {
    if (!this.message && !this.selectedAdminFile) {
      return; 
    }
    const userToken = this.dataservice.getUserData()
    const formData = new FormData();
    
    if (userToken !== null) {
      formData.append('user_token', userToken);
    }
    formData.append('community_id', this.dataservice?.user_community_data.id);
    formData.append('admiposttype', "free");

    if (this.selectedAdminFile) {
      const isImage = this.selectedAdminFile.type.startsWith('image/');
    
      if (isImage) {
        formData.append('community_images', this.selectedAdminFile, this.selectedAdminFile.name);
      }
    }

    if (this.message) {
      formData.append('message', this.message);
    }

    formData.append('community_type', this.dataservice?.user_community_data.account_type);
    this.chatconnect.postFormData(formData, 'community_admin_post').then(
      (result: any) => {
        this.selectedAdminFile = null;
        this.fileAdminName = '';
        this.ionViewDidEnter();
      },
      (err) => {
        console.error(err);
        this.selectedAdminFile = null;
        this.fileAdminName = '';
      }
    );
    this.message = '';
    this.selectedFileName = '';
  }

  timelinePost() {
    if (!this.message && !this.selectedFile) {
      return; 
    }
    const userToken = this.dataservice.getUserData()
    const formData = new FormData();
    if (userToken !== null) {
      formData.append('user_token', userToken);
    }
    formData.append('community_id', this.dataservice?.user_community_data.id);
    formData.append('isadmin', this.dataservice?.user_community_data.same_user_created_community ? '1' : '0');
    
    if (this.selectedFile) {
      const isImage = this.selectedFile.type.startsWith('image/');
    
      if (isImage) {
        formData.append('post_images', this.selectedFile, this.selectedFile.name);
      }
    }

    if (this.message) {
      formData.append('message', this.message);
    }

    formData.append('community_type', this.dataservice?.user_community_data.account_type);
    this.chatconnect.postFormData(formData, 'community_timelime').then(
      (result: any) => {
        this.selectedFile = undefined;
        this.fileName = '';
        if (this.message) {
          let message = {
            text: this.message,
            time: new Date(),
            sender: 'admin'
          };
          this.messages.push(message);
          this.messages.sort((a, b) => a.time.getTime() - b.time.getTime());

          this.selectedFile = undefined;
        this.fileName = '';
        }
        this.ionViewDidEnter();
      },
      (err) => {
        console.error(err);
        this.selectedFile = undefined;
        this.fileName = '';
      }
    );
    this.message = '';
    this.selectedFileName = '';
  }

  async delete_timeline(params: any,params1: any) {
    const popover = document.querySelector('ion-popover')as HTMLIonPopoverElement | null;
    if (popover) {
      const alert = await this.alertController.create({
        header: 'Confirm',
        message: 'Are you sure you want to delete this post?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Yes',
            handler: () => {
              let apidata = {
                user_token: this.dataservice.getUserData(),
                community_id: this.dataservice.user_community_data.id,
                member_id: params,
                row_id: params1,
                command: "delete",
                premium: 0,
                command_Type: "timeline"
              }

              this.chatconnect.postData(apidata, "verify_member").then((result: any) => {
                if (result.Response.status == 1) {
                  this.commonservice.presentToast("", result.Response.message);
                  this.ionViewDidEnter();
                } else {
                  this.commonservice.presentToast("Oops", result.Response.message)
                }
              }, (err) => {
                console.log("Connection failed Messge");
              });
            }
          }
        ],
      });
      await alert.present();
      popover.dismiss();
    }
  }
  
  async deleteMessage(params: any,params1: any) {
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'Are you sure you want to delete this post?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Yes',
          handler: () => {
            // this.commonservice.show("Please Wait");
                  
            let apidata = {
              user_token: this.dataservice.getUserData(),
              community_id:  this.dataservice.user_community_data.id,
              member_id: params,
              row_id:params1,
              command: "delete",
              premium: 0,
              command_Type: "adminpost"
            }
    
            this.chatconnect.postData(apidata, "verify_member").then((result: any) => {
              // this.commonservice.hide();
              if (result.Response.status == 1) {
                this.commonservice.presentToast("", result.Response.message);
                this.All_community();
              } else {
                this.commonservice.presentToast("Oops", result.Response.message)
              }
            }, (err) => {
              console.log("Connection failed Messge");
            });
          }
        }
      ],
    });
    await alert.present();
  }

  All_events(){
    // this.commonservice.show();
    let apidata={
      user_token: this.dataservice.getUserData(),
      community_id: this.dataservice.user_community_data.id,
      premium:  '0',
    }

    this.chatconnect.postData(apidata,"view_event_by_community_id").then((result:any)=>{
      // this.commonservice.hide();
      if(result.Response.status ==1){
        this.events_data=result.Response.events_data;
        this.filterData = this.events_data
        if (this.filterData) {
          this.eventCount = this.filterData.length;
        }
      }else{
        this.commonservice.presentToast("Oops",result.Response.message)
      }
    },(err)=>{ 
      console.log("Connection failed Messge");
    });    
  }
  
  view_details(params:any,params1:any){
    if (params1) {
      this.dataservice.setEventData(params);
      this._router.navigate(['/detailseve']);
    } else {
      this.commonservice.presentToast("","First Joined Community..")
    }
    // if (this.premium == 0) {
    //   this._router.navigate(['/detailseve'])
    // } else if (this.premium == 1) {
    //   this._router.navigate(['/event-details'])
    // }
  }

  invite() {
    const popover = document.querySelector('ion-popover')as HTMLIonPopoverElement | null;
    if (popover) {
      this.dataservice.user_event_data = this.dataservice.user_community_data;
      this._router.navigate(['pages/reinvite', { type: "free_community" }]);
      popover.dismiss();
    }
  }

  formatIndianDate(dateString: string | undefined): string {
    if (!dateString) {
      return ''; 
    }
  
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Asia/Kolkata',
    };
  
    const indianDate = new Date(dateString).toLocaleString('en-IN', options);
    return indianDate;
  }  

  formatTime(time: string): string {
    const isValidTimeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

    if (!isValidTimeFormat) {
      return time;
    }

    const dummyDate = new Date();
    const [hours, minutes] = time.split(':');
    dummyDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    const formattedTime = this.datePipe.transform(dummyDate, 'h:mm a');
    return formattedTime || time;
  }
  
  getCityFromEvent(eventVenues: string): string {
      const city = eventVenues.split(',')[0].trim();
      return city;
  }

  getFormattedDate(eventDate: string): string {
      const date = new Date(eventDate);
        if (!isNaN(date.getTime())) {
        const formattedDate = this.datePipe.transform(date, 'dd MMMM yyyy');
        return formattedDate || '';
      } else {
        return '';
      }
  }
}