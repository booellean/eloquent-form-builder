import base from './baseModel';

export default class input extends base{
    // Added constructor els
    protected subtype: string;

    constructor(el: any){
        super(el);
        this.subtype = el.subtype;
        this.formEl.setAttribute('type', this.subtype);

        this.props.push({ property: 'minlength', name: 'Minumum Length', attr: 'minlength', value: 15 },);

        this.props.forEach( prop =>{
            this.setDataObject(prop);
        })
    }

    // Added methods

}
