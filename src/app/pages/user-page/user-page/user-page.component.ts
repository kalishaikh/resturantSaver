import { Component, HostListener, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Loader } from "@googlemaps/js-api-loader";
import { Resturant } from 'src/models/resturant';
import { ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
})

export class UserPageComponent implements OnInit {

  resturants: Array<any> = []
  name: any;
  lastClick: string = '';
  resturantList: Resturant = new Resturant()
  constructor(private userService: UserService, private changeDetector: ChangeDetectorRef) { 
    
  }

  initAutocomplete() {
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: { lat: 43.6857762, lng: -79.428 },
        zoom: 13,
        mapTypeId: "roadmap",
      }
    );
  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input") as HTMLInputElement;
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
  });

  let markers: google.maps.Marker[] = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();
    const placesJson = JSON.parse(JSON.stringify(places));
    const newResturantName: string = placesJson[0].name;
    const newResturantAddress = placesJson[0].formatted_address;
    this.resturantList.setName(newResturantName);
    this.resturantList.setAddress(newResturantAddress);
 
    if (places?.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    places?.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }
      const icon = {
        url: place.icon as string,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);

    /*If the add button was clicked last*/
    if(this.lastClick =='tr'){
      console.log("tr clicked last");
    }

    else {
      console.log("td clicked last");
      this.updateResturantList();
    }

  });
}
  ngOnInit(): void {

    this.userService.refreshNeeded.subscribe(() => {
      this.userService.getResturants(localStorage.getItem('email')!).subscribe ((response : any ) => {
          this.resturants = response[0].favouriteResturants;
      });
    })

    this.userService.getResturants(localStorage.getItem('email')!).subscribe ((response : any ) => {
      if(response[0]) {
        this.resturants = response[0].favouriteResturants;
        }
      });  

    this.name = localStorage.getItem('name');
    const loader = new Loader({
      apiKey: "AIzaSyAEIfy1Cyl2ZLKJjtwu5dp7_9iG8fdOQMo",
      version: "weekly",
    });
    
    loader.load().then(() => {
      this.initAutocomplete();
    });
  }

  refreshResturantList() {
    this.userService.getResturants(localStorage.getItem('email')!).subscribe ((response : any ) => {
      console.log("Refersh");
      this.resturants = response[0].favouriteResturants;
      this.changeDetector.detectChanges();
    });
  }

  log(){
    console.log("Clicked");
  }

  logout(){
    this.userService.logout();
  }

  addResturant(){
    $("#pac-input").val('');
    $("#pac-input").show();
    $("#pac-input").focus();
    this.setLastClicked("add");
  }

  deleteResturant(event: Event){
    var clickedElement = event.target as HTMLElement;
    var address = $(clickedElement).closest('tr').children('td:first').text();
    this.userService.deleteResturant(localStorage.getItem('email')!, address).subscribe((response) => {
      console.log(response);
    });
    this.refreshResturantList();
  }

  updateResturantList(){
    if(this.resturantList.getName().length > 1 && this.resturantList.getAddress().length > 1) {
        this.userService.updateResturants(this.resturantList.getName(), this.resturantList.getAddress(), localStorage.getItem('email')!).subscribe( (response) => {
          console.log(response);
        });
    }
    else{
      console.log("Text length error");
    }

  }

  searchClickedRow(event : Event){
    $("#pac-input").val('');
    $("#pac-input").hide();
    var input = document.getElementById('pac-input') as HTMLElement;
    var clickedElement = event.target as HTMLElement;
    var address = $(clickedElement).closest('tr').children('td:first').text();
    $('#pac-input').val(address);
    google.maps.event.trigger(input, 'focus', {});
    google.maps.event.trigger(input, 'keydown', { keyCode: 13 });
    google.maps.event.trigger(this, 'focus', {});
    this.setLastClicked("tr");
  }

  setLastClicked(event: string){
    this.lastClick = event;
  }

  getLastClicked(){
    return this.lastClick;
  }
}
