[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-8d59dc4de5201274e310e4c54b9627a8934c3b88527886e3b421487c677d23eb.svg)](https://classroom.github.com/a/fzrjycLm)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-f4981d0f882b2a3f0472912d15f9806d57e124e0fc890972558857b51b24a6f9.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=10555338)
## constant-folding

Constant folding and constant propagation are related compiler optimizations used by many modern compilers. An advanced form of constant propagation known as sparse conditional constant propagation can more accurately propagate constants and simultaneously remove dead code. 

Constant folding is the process of recognizing and evaluating constant expressions at compile time rather than computing them at runtime. Terms in constant expressions are typically simple literals, such as the integer literal '2', but they may also be variables whose values are known at compile time. Consider the statement:

```i = 320 * 200 * 32;```

Most compilers would not actually generate two multiply instructions and a store for this statement. Instead, they identify constructs such as these and substitute the computed values at compile time (in this case, 2,048,000).

Constant folding can make use of arithmetic identities. If x is numeric, the value of 0 * x is zero even if the compiler does not know the value of x (note that this is not valid for IEEE floats since x could be Infinity or NaN. Still, some environments that favor performance such as GLSL shaders allow this for constants, which can occasionally cause bugs).

Constant folding may apply to more than just numbers. Concatenation of string literals and constant strings can be constant folded. Code such as "abc" + "def" may be replaced with "abcdef". 

## Installation

Install from the command line:
```bash
$ npm install @alu0101127163/constant-folding
```
Install via package.json:
```json
"@alu0101127163/constant-folding": "1.0.6" 
```

## Usage from code:

```javascript
const constantFolding = require('constant-folding');
//call the function
```


## Test

Para poder desarrollar nuestras pruebas de producción sobre nuestro módulo npm, primero añadimos la dependencia en el `package.json` y la instalamos con `npm i`. Una vez instalado el módulo creamos los test que queremos probar con la última version del módulo. 

```js
const constantFolding = require("@alu0101127163/constant-folding");
const should = require('chai').should();

const Checks = [
  { text: "[a, b, c].join();", result: "'a,b,c';" },
  { text: "[a, b, c].join('@');", result: "'a@b@c';" },
  { text: "[1, 2, 3].length;", result: "3;" },
  { text: "[1, 2, 3][2-1];", result: "2;" },
  { text: "[1, 2, 3].shift();", result: "1;" },
  { text: "[a, b, c].pop();", result: "'c';"},
  { text: "'abc'[0];", result : "'a';"},
  { text: "'abc'.charAt();", result: "'a';"},
  { text: "'abc'.charAt(1);", result: "'b';"},
  { text: "'abc'.length;", result: "3;"},
  { text: "'a,b,c'.split(',');", result: "a,b,c;"},
  { text: "(100 + 23).toString();", result: "'123';" },
];

describe('constantFolding tests', () => {
  for (let c of Checks) {
    it(`Test ${c.text} = ${c.result}`, () => {
      constantFolding(c.text).should.equal(c.result);
    });
  }
});
```

Ejecutamos el script `test` y nos mostrará todas las pruebas que hemos creado. Así cada vez que haya una nueva versión del módulo, podemos venir a este repositorio, inicializar las pruebas que creamos necesarias y las probramos para ver si funciona correctamente el módulo implementado con todas nuestras pruebas.

## Author

alu0101127163

## Tests

