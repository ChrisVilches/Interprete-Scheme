"use strict";

/*
Clase abstracta para un nodo. La funcion eval() se puede
implementar de varias formas, dependiendo de que tipo de nodo sea.
Por ejemplo existen nodos de suma, division, y tambien nodos
de valores numericos primitivos.
*/
abstract class Nodo{
    izq:Nodo;
    der:Nodo;
    abstract eval() : number;
    constructor(i, d){
        this.izq = i;
        this.der = d;
    }
}


class Suma extends Nodo{
    
    eval() : number{
        return this.izq.eval() + this.der.eval();
    }    
}

class Resta extends Nodo{    
    eval() : number{
        return this.izq.eval() - this.der.eval();
    }    
}

class Multi extends Nodo{    
    eval() : number{
        return this.izq.eval() * this.der.eval();
    }    
}

class Div extends Nodo{    
    eval() : number{
        return this.izq.eval() / this.der.eval();
    }    
}

// Nodo de tipo numerico (no tiene nodos hijos)
class Valor extends Nodo{
    
    private valorNumerico : number;
    
    eval() : number{
        return Number(this.valorNumerico);
    }
    
    constructor(n : number){
        super(null, null);
        this.valorNumerico = n;
    }
}


module NodoFactory{
    
    // Funcion que retorna cualquier tipo de nodo dependiendo de los parametros.
    export function crearNodo(nodoArg) : Nodo{
        
        if(nodoArg.hasOwnProperty('valorNumerico')){
            return new Valor(nodoArg.valorNumerico);
        } else if(nodoArg.operacion == '+'){            
            return new Suma(nodoArg.arg1, nodoArg.arg2);            
        } else if(nodoArg.operacion == '-'){            
            return new Resta(nodoArg.arg1, nodoArg.arg2);            
        } else if(nodoArg.operacion == '*'){            
            return new Multi(nodoArg.arg1, nodoArg.arg2);            
        } else if(nodoArg.operacion == '/'){            
            return new Div(nodoArg.arg1, nodoArg.arg2);            
        }     
        return null;
    }  
}