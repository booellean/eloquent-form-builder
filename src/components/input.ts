import base from './baseModel';

export default class input extends base{
    // Added constructor els
    protected subtype: string;

    constructor(el: any = {type: 'input', subtype: 'text', name: 'Input'}){
        super(el);
        this.subtype = el.subtype;
        this.formEl.setAttribute('type', this.subtype);
    }

    // Added methods

}
