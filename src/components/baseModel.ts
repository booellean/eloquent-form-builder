export default class base{
    //default element properties

    protected formEl: HTMLElement;
    protected label: HTMLElement;
    protected id: string;
    protected classes: Array<string>;
    protected value: string;
    protected required: boolean;

    constructor(el: any){
        console.log(el);

        this.formEl = document.createElement(el.type);
        this.id = '1';
        this.formEl.id = this.id;
        this.label = document.createElement('label');
        this.label.innerHTML= el.name;
        this.label.setAttribute('for', this.id);
        this.classes = [];
        this.value = el.value || '';
        this.required = false;

    }

    //default methods
}
