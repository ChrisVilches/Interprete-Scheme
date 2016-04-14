"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
Clase abstracta para un nodo. La funcion eval() se puede
implementar de varias formas, dependiendo de que tipo de nodo sea.
Por ejemplo existen nodos de suma, division, y tambien nodos
de valores numericos primitivos.
*/
var Nodo = (function () {
    function Nodo(i, d) {
        this.izq = i;
        this.der = d;
    }
    return Nodo;
}());
var Suma = (function (_super) {
    __extends(Suma, _super);
    function Suma() {
        _super.apply(this, arguments);
    }
    Suma.prototype.eval = function () {
        return this.izq.eval() + this.der.eval();
    };
    return Suma;
}(Nodo));
var Resta = (function (_super) {
    __extends(Resta, _super);
    function Resta() {
        _super.apply(this, arguments);
    }
    Resta.prototype.eval = function () {
        return this.izq.eval() - this.der.eval();
    };
    return Resta;
}(Nodo));
var Multi = (function (_super) {
    __extends(Multi, _super);
    function Multi() {
        _super.apply(this, arguments);
    }
    Multi.prototype.eval = function () {
        return this.izq.eval() * this.der.eval();
    };
    return Multi;
}(Nodo));
var Div = (function (_super) {
    __extends(Div, _super);
    function Div() {
        _super.apply(this, arguments);
    }
    Div.prototype.eval = function () {
        return this.izq.eval() / this.der.eval();
    };
    return Div;
}(Nodo));
// Nodo de tipo numerico (no tiene nodos hijos)
var Valor = (function (_super) {
    __extends(Valor, _super);
    function Valor(n) {
        _super.call(this, null, null);
        this.valorNumerico = n;
    }
    Valor.prototype.eval = function () {
        return Number(this.valorNumerico);
    };
    return Valor;
}(Nodo));
var NodoFactory;
(function (NodoFactory) {
    // Funcion que retorna cualquier tipo de nodo dependiendo de los parametros.
    function crearNodo(nodoArg) {
        if (nodoArg.hasOwnProperty('valorNumerico')) {
            return new Valor(nodoArg.valorNumerico);
        }
        else if (nodoArg.operacion == '+') {
            return new Suma(nodoArg.arg1, nodoArg.arg2);
        }
        else if (nodoArg.operacion == '-') {
            return new Resta(nodoArg.arg1, nodoArg.arg2);
        }
        else if (nodoArg.operacion == '*') {
            return new Multi(nodoArg.arg1, nodoArg.arg2);
        }
        else if (nodoArg.operacion == '/') {
            return new Div(nodoArg.arg1, nodoArg.arg2);
        }
        return null;
    }
    NodoFactory.crearNodo = crearNodo;
})(NodoFactory || (NodoFactory = {}));
//# sourceMappingURL=nodos.js.map