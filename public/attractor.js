class Attractor {
  
   constructor(x,y,m,p = p5.instance) {
   this.p = p;
     this.pos = p.createVector(x,y);
     this.mass = m;
     this.r = p.sqrt(this.mass)*2;
   }
   
   attract(mover) {
     let force = p5.Vector.sub(this.pos, mover.pos);
     let distanceSq = this.p.constrain(force.magSq(), 100, 200);
     let G = 0.1;
     let strength = G * (this.mass * mover.mass) / distanceSq;
     force.setMag(strength);
     mover.applyForce(force);
   }
   
   
   show() {
     this.p.noStroke();
     this.p.fill(255,0, 100);
     this.p.ellipse(this.pos.x, this.pos.y, this.r*2);    
   }
 }