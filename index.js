// *********** Bind() implementation ***********
const bind = function(fn, context) {
    // slice additional arguments without fn and context
    const bindArgs = [].slice.call(arguments, 2);

    return function() {
        // all arguments are necessary
        const fnArgs = [].slice.call(arguments);

        return fn.apply(context, bindArgs.concat(fnArgs));
    };
};

// *********** Object.create() implementation ***********
if (typeof Object.create !== 'function') {
    Object.create = function(o, props) {
        function F() {}
        F.prototype = o;
   
        if (typeof(props) === "object") {
            for (prop in props) {
                if (props.hasOwnProperty((prop))) {
                    F[prop] = props[prop];
                }
            }
        }

        return new F();
    };
};

// or

const create = (proto, props) => {
    const newObject = {};

    Object.setPrototypeOf(newObject, proto);
    return newObject;
};

// *********** constructor() method explanation ***********
const cat = {
    constructor(name) {
        this.name = name;
        return this;
    },
    getName() {
        return this.name;
    }
};

const Tom = Object.create(cat).constructor('Tom');
Tom.getName(); // Tom

// *********** new Function() implementation ***********
const newImplementation = function(constructor) {
    const newObject = {};

    Object.setPrototypeOf(newObject, constructor.prototype);

    // get all arguments without constructor
    //const argsArray = Array.from(arguments).slice(1); OR
    const argsArray = [].slice.apply(arguments).slice(1);

    return constructor.apply(newObject, argsArray) || newObject;
};

// *********** class implementation ***********
// ES6
class Cat {
    constructor(name) {
        this.name = name;
    }

    get name() {
        return this.name;
    }

    set name(name) {
        this.name = name;
    }

    run() {
        console.log(`${this.name} is running`);
    }

    static jump() {
        console.log(`${this.name} is jumping`);
    }
}

class Kitty extends Cat {
    constructor(name) {
        super(name);
    }
}

//ES5
function Cat(name) {
    this.name = name;
}

Object.defineProperty(Cat, name, {
    get: function() {
        return this.name;
    },
    set: function(name) {
        this.name = name;
    }
});

Cat.prototype.run = function() {
    console.log(`${this.name} is running`);
};

Cat.jump = function() {
    console.log(`${this.name} is jumping`);
};

function Kitty(name) {
    Cat.call(this, name);
}

Kitty.prototype = Object.create(Cat.prototype);
Kitty.prototype.constructor = Kitty;

// *********** requestAnimationFrame polyfill ***********
(() => {
    const vendors = ['ms', 'moz', 'webkit', 'o'];
    let lastTime = 0;

    for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[`${vendors[x]}RequestAnimationFrame`];
        window.cancelAnimationFrame = window[`${vendors[x]}CancelAnimationFrame`] 
                                   || window[`${vendors[x]}CancelRequestAnimationFrame`];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (callback, element) => {
            const currTime = new Date().getTime();
            const timeToCall = Math.max(0, 16 - (currTime - lastTime));
            const id = window.setTimeout(
                () => {callback(currTime + timeToCall);}, 
                timeToCall
              );

            lastTime = currTime + timeToCall;

            return id;
        };
    }

    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = id => {clearTimeout(id);};
}());
