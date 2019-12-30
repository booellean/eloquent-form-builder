import { EventEmitter } from "events";

export default class base implements CustomObj{
    //default element properties

    // This is necessary for implementation of calling a function by index in the setDataObject() function,
    //let newEditField = this[prop.editOptionFunc](this.data[prop.property]);
    [key: string]: any


    protected label: HTMLElement = document.createElement('label');
    protected formEl: HTMLFormElement;
    protected edits: HTMLElement;

    // The entire HTML object, the form element and edits box
    protected platform: HTMLElement = document.createElement('li');

    // TODO: Stretch goal, tooltip data to answer FAQ, such as What is a placeholder vs value?
    /**
     * Default properties: These are outlined in all the classes and will create fields to edit your added form element
     * Any Where where you would like to add changes, note that this is the place to start. It is structured to make it easy
     * to both add properties and change them. Dont' forget to change this.setDataObject() as well!
     */
    public props: Array<any> = [
        { property: 'label', name: 'Label', attr: 'label', value: '', editOptionFunc: 'editOptionTextInput' },
        { property: 'placeholder', name: 'Placeholder', attr: 'placeholder', value: '', editOptionFunc: 'editOptionTextInput' },
        { property: 'value', name: 'Value', attr: 'value', value: '', editOptionFunc: 'editOptionTextInput' },
        { property: 'required', name: 'Placeholder', attr: 'required', value: false, editOptionFunc: 'editOptionTextInput' },
    ]
    // This is the data object. It will be instantiated from the Array above in this.setDataObject()
    public data: CustomObj = {}

    private editOpen: boolean = false;

    // Emit event for delete call
    public emitter:EventEmitter = new EventEmitter();

    constructor(el: CustomObj){

        if(el.options){
            // TODO: checks for default values included in the element passed

            // if(el.options.label)
        }

        const buttonHolder: HTMLElement = document.createElement('div');
        const preview: HTMLElement = document.createElement('div');
        this.edits = document.createElement('section');
        this.edits.appendChild(document.createElement('div'));
        this.edits.className = 'editable-content';
        this.edits.style.height = '0px';

        const closeButton: HTMLElement = document.createElement('span');
        const editButton: HTMLElement = document.createElement('span');
        //stretch goal
        // const cloneButton: HTMLElement = document.createElement('button');

        // Buttons with bulma classes to make edits or delete items;
        closeButton.className = 'icon has-background-danger	has-text-white closebutton';
        closeButton.setAttribute('role', 'button');
        closeButton.setAttribute('aria-pressed', 'false');
        closeButton.setAttribute('aria-label', 'Remove Element from Form');
        closeButton.addEventListener('click', ()=>{
            this.emitter.emit('deletenode');
        });

        editButton.className = 'icon has-background-info has-text-white editbutton';
        editButton.setAttribute('role', 'button');
        editButton.setAttribute('aria-pressed', 'false');
        editButton.setAttribute('aria-label', 'Edit form attributes');
        editButton.addEventListener('click', () => {
            this.editOpen = !this.editOpen;
            this.editOpen ? this.edits.classList.add('open') : this.edits.classList.remove('open');
            this.editOpen ? this.edits.style.height = `${this.edits.scrollHeight}px` : this.edits.style.height = '0';
        });

        buttonHolder.className = 'button-holder';
        buttonHolder.appendChild(editButton);
        buttonHolder.appendChild(closeButton);

        // The actual form element and Label
        this.formEl = document.createElement(el.type);
        this.formEl.id = `${el.type}-${Math.floor(Math.random()*100000)}`;
        this.formEl.className = '';
        this.formEl.setAttribute('value', '');
        this.formEl.disabled = true;

        this.label.setAttribute('for', this.formEl.id);
        // TODO: Put this code in options later
        this.label.innerHTML = el.name;
        this.label.className = 'label';

        preview.appendChild(buttonHolder);
        preview.appendChild(this.label);
        preview.appendChild(this.formEl);
        // TODO: figure out the classes for the different form elements
        // preview.className = classes;

        this.platform.id = `li-${this.formEl.id}`;
        // Be carefule if you change this class. It will affect how the cloned drag image works later
        this.platform.classList.add('form-item');
        this.platform.appendChild(preview);
        this.platform.appendChild(this.edits);
    }

    // Get and Set Methods
    get formElementData(): HTMLElement{
        return this.platform;
    }

    // TODO: Return formatted json for Eloquent forms
    get elementData(): CustomObj{
        return { key : 'value'};
    }

    set formElementData(el: HTMLElement) {
        // TODO: Do I really need this setter? Maybe overkill
        this.platform = el;
    }

    // Formatting methods
    setDataObject(prop: CustomObj){
        if(!this.data[prop.property]){
            const isLabel = prop.property === 'label' ? true : false;
            this.data[prop.property] = {
                // value : isLabel ? 'Label' : el.options[prop].value || '', // Need to do nested checks!
                value : isLabel ? this.label.innerHTML : '',
                name : prop.name,
                boundEl : isLabel ? this.label : this.formEl,
                boundAttr : prop.attr,
                get data(){
                    return this.value;
                },
                set data(val: string){
                    this.value = val;
                    if(isLabel){
                        this.boundEl.innerHTML = val;
                    }else{
                        this.boundEl.setAttribute(prop.attr, val);
                    }
                }
            };
        }

        let newEditField = this[prop.editOptionFunc](this.data[prop.property]);
        if(this.edits.firstChild) this.edits.firstChild.appendChild(newEditField);
    }

    /**
     *
     * @param fieldDat
     *
     * Takes in the data from a newly created property and outputs an edit section div
     * This edit is formatted to an input type=text
     * Event listeners and Mutation Observers are here to watch for changes between the DOM objects and data object
     */

    protected editOptionTextInput(fieldDat: CustomObj): HTMLElement{

        let editDiv: HTMLElement = document.createElement('div');

        let editLabelInput: HTMLInputElement = document.createElement('input');
        editLabelInput.type = 'text';
        editLabelInput.id = `${fieldDat.boundAttr}-${this.formEl.id}`;
        editLabelInput.value = fieldDat.value;
        editLabelInput.className = 'input';

        let editLabel: HTMLElement = document.createElement('label');
        editLabel.innerHTML = fieldDat.name;
        editLabel.className = 'label';
        editLabel.setAttribute('for', editLabelInput.id);

        // Event Listeners to change properties from user input
        editLabelInput.addEventListener('keyup', ()=>{
            if(fieldDat.boundAttr === 'label'){
                fieldDat.boundEl.innerHTML = editLabelInput.value;
            }else{
                fieldDat.boundEl.setAttribute(fieldDat.boundAttr, editLabelInput.value);
            }
            fieldDat.value = editLabelInput.value
        })

        // Mutation Observer to change data if a user calls the getter or setter of the object
        const observer = new MutationObserver( (mutations) =>{
            mutations.forEach( mutation =>{
                if (mutation.type === 'attributes'){ //All attribute changes
                    editLabelInput.value = fieldDat.boundEl[fieldDat.boundAttr];
                }else{
                    editLabelInput.value = fieldDat.boundEl.innerHTML;
                }
            })
        })

        observer.observe(fieldDat.boundEl, {
            attributes: true,
            subtree: true,
            childList: true  // For changes to the Label's innerHTML
        })

        editDiv.appendChild(editLabel);
        editDiv.appendChild(editLabelInput);
        return editDiv;
    }
}
