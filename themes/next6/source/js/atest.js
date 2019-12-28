function Shape() {}
Shape.prototype.duplicate = function() {
  console.log("duplicate");
};

function Circle(radius, color) {
  Shape.call(this, color);
  this.radius = radius;
}
Circle.prototype.draw = function() {
  console.log("draw");
};

const s = new Shape();
const c = new Circle(1);

Circle.prototype = Object.create(Object.prototype); //objectBase

// Circle.prototype.constructor=Circle
// new Circle.prototype.constructor() =>new Circle()
// Circle.prototype = Object.create(Shape.prototype);
// Circle.prototype.constructor = Circle;

function extend(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
}
extend(Circle, Shape);
