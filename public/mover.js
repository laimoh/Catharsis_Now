class Mover {
   constructor(x, y, m) {
      this.w = 250;
      this.h = 50;
      this.pos = createVector(x, y);
      this.speed = p5.Vector.random2D();
      this.speed.mult(2);
      this.acc = createVector(0,0)
      this.mass = m
      // this.w = sqrt(this.mass) * 2;
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

   show(string, font) {
      textSize(20);
      textFont(font);
      fill(134, 230, 129);
      text(string, this.pos.x, this.pos.y, this.w, this.h); // x, y, (textbox) width, height
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