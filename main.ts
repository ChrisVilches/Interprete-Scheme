/// <reference path="jquery.d.ts"/>
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



namespace interpreteScheme{
    
    /* Expresion de la forma (+ a b) o tambien puede ser (+ () ()) es decir con mas expresiones dentro */
    /* El retorno de este Regex es la operacion, y los dos argumentos JUNTOS en una sola variable */
    var expresionOperacion : RegExp = /^\s*\(\s*([\+|\-|\*|\/])\s+(([0-9]+|\(.+?\))\s+([0-9]+|\(.+\)))\s*\)\s*$/;
    
    /* Valor numerico */
    var expresionValorPrimitivo : RegExp = /^\s*([0-9]+)\s*$/;   
    
    
    /* Verifica que un codigo de Scheme tenga parentesis balanceados */
    function esBalanceada(str) : boolean{
        
        var nivel = 0;
        
        for(var i=0; i<str.length; i++){
            
            if(str[i] == '('){
                nivel++;
            } else if(str[i] == ')'){
                nivel--;
                if(nivel == -1) return false;
            }            
        }        
        if(nivel == 0) return true;        
        return false;        
    }
    
    // Entrada: string con ambos argumentos (string preprocesada sin espacios extra)
    // Salida: un arreglo de dos strings, cada una con un argumento
    function splitArgs(str) : string[]{
        
        var arreglo = [];
        
        if(str[0] == '('){
            // El caso en donde el primero es una expresion con parentesis
            // Se debe contar hasta que quede balanceado
            var nivel = 1;
            for(var i=1; i<str.length; i++){            
                if(str[i] == '('){
                    nivel++;
                } else if(str[i] == ')'){
                    nivel--;
                    if(nivel == 0) break;
                }            
            } 
            
            arreglo[0] = str.substring(0, i+1);
            arreglo[1] = str.substring(i+2);
            return arreglo;
            
        } else {            
            // El primero es un numero
            arreglo = str.split(/ (.+)?/,2);
            return arreglo;            
        }
        
    }
    
     
    
    function compilarRecursivo(str) : Nodo{
        
        if(!esBalanceada(str)){
            return null;
        } 
        
        
        var extraidos;

        
        // Probar usando una operacion del tipo (+ a b) o (+ () ())
        if((extraidos = str.match(expresionOperacion)) != null){      
            
            // extraidos[1] contiene la operacion
            // extraidos[2] contiene ambos argumentos
            // Los argumentos no se pueden separar usando Regex en Javascript
            
            // Por eso se separan usando esta funcion...
            var args = splitArgs(extraidos[2]);
            
            var arg1 : any = args[0];
            var arg2 : any = args[1]; 
            
            // Compilar las dos expresiones que hay dentro del (+ a b)        
            arg1 = compilar(arg1);
            arg2 = compilar(arg2);    
            
            if(arg1 == null || arg2 == null) {
                return null;    
            }
            
            var objFactory = {
                operacion: extraidos[1], 
                arg1: arg1, 
                arg2: arg2
            };
                
            return NodoFactory.crearNodo(objFactory);
        }  

        // Probar usando valor primitivo
        if((extraidos = str.match(expresionValorPrimitivo)) != null){   
            
            // La expresion es un valor numerico primitivo, asi que se compila
            // un nodo de valor primitivo. Aca se acaba la recursion.
            return NodoFactory.crearNodo({valorNumerico: extraidos[1]});
        }            
        
        
        
        
    }
    
    /* Compila un codigo de Scheme y retorna el primer nodo del arbol */
    function compilar(str) : Nodo{    
        
        // Aca se preprocesa la string
        str = str.replace(/\s+/g, " "); // Eliminar espacios dobles
        str = str.trim(); // Sacar espacios de los extremos                       
        
        return compilarRecursivo(str);
        
        /*
        // Esta variable contiene todas las strings que se extraen al aplicar
        // la expresion regular. Un ejemplo podria ser:
        // extraidos[0] = {expresion completa}
        // extraidos[1] = '+'
        // extraidos[2] = '6'
        // extraidos[3] = '(+ 9 5)'
        // Entonces se compilan recursivamente hasta retornar un valor primitivo
        var extraidos;

        
        // Probar usando una operacion del tipo (+ a b) o (+ () ())
        if((extraidos = str.match(expresionOperacion)) != null){       
            
            // Compilar las dos expresiones que hay dentro del (+ a b)        
            extraidos[2] = compilar(extraidos[2]);
            extraidos[3] = compilar(extraidos[3]);    
            
            if(extraidos[2] == null || extraidos[3] == null) {
                return null;    
            }
                
            return NodoFactory.crearNodo(extraidos);
        }  

        // Probar usando valor primitivo
        if((extraidos = str.match(expresionValorPrimitivo)) != null){   
            
            // La expresion es un valor numerico primitivo, asi que se compila
            // un nodo de valor primitivo. Aca se acaba la recursion.
            return NodoFactory.crearNodo(extraidos);
        }            
                
        return null;
        */
    } 
    
    export function evalExp(str) : number{
        
        // Compilar el codigo en un arbol, y obtener una referencia al nodo origen
        var nodoPrincipal : Nodo = compilar(str);
        
        if(nodoPrincipal == null) return null;
        
        return nodoPrincipal.eval();
    }    
}


(function(){
    
    
    $(document).ready(function(){
        
        $("#ejecutarCodigo").submit(function(event){
                        
            event.preventDefault();
            
            var codigo : string = $("#entrada").val();
            var resultado : number = interpreteScheme.evalExp(codigo);
            var append : string;
            
            if(resultado != null){
                // Correcto
                append = "<div class='resultado'><span class='codigo'><small>&gt;</small> "+codigo+"</span>"+
                                  "<span class='resultado'>"+resultado+"</span></div>";                
                
            } else {                
                // Sintaxis erroneo
                append = "<div class='resultado'><span class='codigo'><small>&gt;</small> "+codigo+"</span>"+
                                  "<span class='resultado error'><i>Error de sintaxis</i></span></div>";                 
                
            }           
            
            // Agregar la string a la pantalla
            $("#resultados").prepend(append);            
            
        });        
        
    });
    
    
})();
 


