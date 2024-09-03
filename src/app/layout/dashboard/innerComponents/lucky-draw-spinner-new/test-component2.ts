import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tes-app2',
  templateUrl: './test-component2.html',
  styleUrls: [ './test-component2.scss' ]
})
export class TestComponent2 implements OnInit  {
  objectsArray: any[] = []; // Array of 30 objects
  displayedName: string | null = null; // Displayed name
  highlightedIndex: number | null = null;
  winnerIndex= 5;
  numberOfPortions = 10; // Specify the number of portions
  // portions = Array.from({ length: this.numberOfPortions });

  // numberOfPortions = 10;
  portions: { color: string }[] = [];
  removeImage = false;

  constructor() {}

  ngOnInit(): void {
    // Populate the objectsArray with 30 objects
    // For example:

    // working
    for (let i = 0; i < 20; i++) {
      this.objectsArray.push({ id: i, name: `Object ${i + 1}` });
    }

    // Start the animation after a delay
    // setTimeout(() => {
    //   this.animateObjects();
    // }, 2000); // Delay of 2 seconds before animation starts




  //  working
    setTimeout(() => {
      this.startBackgroundColorChange();
    }, 1000); 
    console.log("startBackgroundColorChange");




    // for (let k = 0; k == this.objectsArray.length; k++) {
      // this.startBackgroundColorChange();
    // }
    // this.startBackgroundColorChange();
    // setTimeout(() => {
    //   this.highlightRandomIndex();
    // }, 9000);

// debugger;
//     const wheelElement = document.getElementById('wheel');
// const numberOfPortions = 10; 
// for (let i = 0; i < numberOfPortions; i++) {
//   const portion = document.createElement('div');
//   portion.classList.add('portion');
//   portion.style.transform = `rotate(${(360 / numberOfPortions) * i}deg)`;
//   portion.style.backgroundColor = this.getRandomColor(); 
//   wheelElement.appendChild(portion);
// }

// this.generatePortions();
  

  }

  private generatePortions(): void {
    for (let i = 0; i < this.numberOfPortions; i++) {
      this.portions.push({ color: this.getRandomColor() });
    }
  }

  

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // startBackgroundColorChange() {
  //   let index = 0;
  //   const intervalId = setInterval(() => {
  //     this.objectsArray[index].highlight = true;
  //     setTimeout(() => {
  //       this.objectsArray[index].highlight = false;
  //       index++;
  //       if (index === this.objectsArray.length) {
  //         clearInterval(intervalId);
  //       }
  //     }, 5);
  //   }, 5);
  // }

  startBackgroundColorChange() {
   
    let index = 0;
    let timePassed = 0; // Track the time passed in seconds
    const intervalId = setInterval(() => {
    
      // this.highlightedIndex = index;
      // this.displayedName = this.objectsArray[index].name;
      let randomIndex = this.highlightRandomIndex();
      index++;
      timePassed++;
      if (randomIndex === this.winnerIndex&& timePassed >= 60) {
        this.displayedName = this.objectsArray[randomIndex].name+ "is winner";
        this.objectsArray[randomIndex].removeImage= true;
        clearInterval(intervalId);
      }
    }, 100);
  }

  highlightRandomIndex() {
    // debugger;
    const randomIndex = Math.floor(Math.random() * this.objectsArray.length);
    this.displayedName = this.objectsArray[randomIndex].name;
    this.highlightedIndex = randomIndex;
    return randomIndex;
  }

  animateObjects() {
    let index = 0;
    const stopIndex = Math.floor(Math.random() * this.objectsArray.length); // Random index to stop at
    const interval = setInterval(() => {
      this.displayedName = null; // Reset the displayed name
      this.displayedName = this.objectsArray[index].name; // Set the name to be displayed
      index++;

      // Stop the animation when the random index is reached
      if (index >= this.objectsArray.length || index === stopIndex) {
        clearInterval(interval);
      }
    }, 500); // Delay between each object animation
  }
}
