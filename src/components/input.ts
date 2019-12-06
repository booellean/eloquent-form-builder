import base from './baseModel';

export default class input extends base{
    // Added constructor els
    protected subtype: string;

    protected formElClasses: Array<string> = ['type-text', 'field'];

    // protected formElClasses: Array<string> = ['type-select', 'field'];

    constructor(el: any){
        super(el);
        this.subtype = el.subtype;
        this.formEl.setAttribute('type', this.subtype);
        this.formEl.classList.add('input');
        this.formElClasses.forEach (c =>{
            this.platform.classList.add(c);
        })

        this.props.push({ property: 'minlength', name: 'Minumum Length', attr: 'minlength', value: 15, editOptionFunc: 'editOptionTextInput' });

        // TODO: Always do the call here????
        this.props.forEach( prop =>{
            this.setDataObject(prop);
        })
    }

    // Added methods

}
