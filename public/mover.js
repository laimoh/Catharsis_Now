class Mover {
   constructor(x, y, m, p = p5.instance) {
      this.p = p;
      this.w = 250;
      this.h = 50;
      this.pos = p.createVector(x, y);
      this.speed = p5.Vector.random2D();
      this.speed.mult(2);
      this.acc = p.createVector(0,0)
      this.mass = m
      this.brightness = 134;
   }
 
   update() {
     this.speed.add(this.acc)
     this.pos.add(this.speed)
     this.acc.set(0,0)
   }


   applyForce(force) {
      let f = p5.Vector.div(force, this.mass);
      this.acc.add(f);
   }

   mouseOnText(px, py) {
      const p = this.p
      let d = p.dist(px, py, this.pos.x, this.pos.y)
      if (d < this.w && d < this.h) {
         // .style.cursor = "pointer";
         this.brightness = 255;
         console.log('mouseOver')
      }
   }

   show(string, font) {
      const p = this.p
      p.textSize(20);
      p.textFont(font);
      // p.fill(134, 230, 129);
      p.fill(134, 230, 129, this.brightness)
      p.rectMode(p.CENTER);
      p.text(string, this.pos.x, this.pos.y, this.w, this.h); // x, y, (textbox) width, height
   }

   // edges() {
   //    if (this.pos.y >= height - this.h) {
   //       this.pos.y = height - this.h;
   //       this.speed.y *= -1
   //    }
   //    if (this.pos.x >= width - this.w) {
   //       this.pos.x = width - this.w
   //       this.speed.x *= -1
   //    }

   //    if (this.pos.y <= 0) {
   //       this.pos.y = 0
   //       this.speed.x *= 1
   //    }
      
   //    if (this.pos.x <= 0) {
   //       this.pos.x = 0
   //       this.speed.x *= 1
   //    }
   // }
 
 }