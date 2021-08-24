export class Resturant {

    resturantAddress : string = '';
    resturantName : string = '';

    constructor() {
        
    }
    

    getName() : string {
        return this.resturantName
    }

    getAddress() : string {
        return this.resturantAddress
    }

    setName(newName: string) {
        this.resturantName = newName;
    }

    setAddress(newAddress: string) {
        this.resturantAddress = newAddress;
    }
    
}
