import '../scss/index.scss';
import extend from 'lodash/extend';
import Emitter from 'es6-event-emitter';
import core from './core';
import { relative } from 'path';


let defaults = {
    target: '',
    placeholder: '',
    editor: false,
}

let elem = null;


export class ContentManager extends Emitter {
    constructor(options = {}) {
        super();

        defaults = extend(defaults, options)

        if (defaults.target) {

            this.elem = document.querySelector(defaults.target);
            this.elem.dataset["time"] = new Date().getTime();
            this.elem.dataset["name"] = "ali";
            this.elem.classList.add("cm-wrapper");
            
            this.core = new core(this.elem, defaults);
            
            
            this.core.init();

        } else {
            console.error("you must select element by options 'target'")
        }
    }


    getData = () =>{
        return this.core.getData();
    }

}


export default ContentManager;