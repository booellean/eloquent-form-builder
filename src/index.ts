import { defaultOptions } from './defaultOpts';
const Styles = require('./styles.scss');

export class FormBuilder {
    private base: HTMLElement;
    private wrapper: HTMLElement;
    private list: HTMLElement;
    private dragEl: string;
    protected formData: Array<object>;

    constructor(element: string, options: Array<object> = defaultOptions){
        // TODO: if there is no element passed, then the application will not work....
        // There must be a better way to clear this check and alert a user if this isn't instantiating
        this.base = document.getElementById(element) || document.createElement('div');
        this.base.classList.add('form-wrapper');
        this.wrapper = document.createElement('ul');
        this.formData = [];
        this.dragEl = 'no selection';

        this.wrapper.id = 'form-build';

        this.list = document.createElement('ul');
        this.list.id = 'form-options';

        defaultOptions.forEach( (item, index) => {
            const li = document.createElement('li');
            li.innerHTML = item.name;
            li.id = index.toString();
            li.setAttribute('draggable', 'true');

            // Add event listeners for list item... creates drag and drop functionality and creating new form block
            li.addEventListener('click', () => this.createNewFormElement(item));

            li.addEventListener('dragstart', (e: DragEvent) => this.onDragStart(li, item, e), false);
            li.addEventListener('dragenter', (e: DragEvent) => this.onDragEnter(li, item, e), false);
            li.addEventListener('dragover', (e: DragEvent) => this.onDragOver(li, item, e), false);
            li.addEventListener('dragleave', (e: DragEvent) => this.onDragLeave(li, item, e), false);
            li.addEventListener('drop', (e: DragEvent) => this.onDrop(li, item, e), false);
            li.addEventListener('dragend', (e: DragEvent) => this.onDragEnd(li, item, e), false);
            this.list.append(li);
        });

        this.wrapper.addEventListener('dragover', (e: DragEvent) => this.onDragOver(this.wrapper, {}, e), false);
        this.wrapper.addEventListener('drop', (e: DragEvent) => this.onDrop(this.wrapper, {}, e), false);

        this.base.append(this.list);
        this.base.append(this.wrapper);
    }

    // TODO: build on methods
    // Inherit for each form element prior to instantiation

    async createNewFormElement(item: any){
        let name = item.type;

        // In order to dynamically instantiate a class, must asynchronously import the class here.
        // NOTE: The class names are going to coincide with the item.type, so BE CAUTIOUS WHEN CHANGING CLASS NAMES OR TYPES
        // Once imported, a new instance can be instantiated

        const plug = await import(`./components/${name}`);
        const constructorName = Object.keys(plug)[0];

        const newInstance = new plug[constructorName](item);

        console.log(newInstance);
    }

    // Drag and Drop Events
    /**
     * Code Partially derived from Shayna Lekohmaher
     * https://codepen.io/lorelea/pen/WRqQyy
     * Visited 12/2/2019
     */

    onDragStart(el: HTMLElement, data: object, e: DragEvent){
        const t = e.dataTransfer;
        this.dragEl = el.id;
        el.classList.add('drag-moving'); // muted colors, this is moving
        if(t){
            t.effectAllowed = 'move';
            t.setData('text/html', el.innerHTML);
        }
    }

    onDragEnter(el: HTMLElement, data: object, e: DragEvent){
        el.classList.add('drag-hover'); // highlighted colors. This may be moved
        e.preventDefault();
    }

    onDragOver(el: HTMLElement, data: object, e: DragEvent){
        const t = e.dataTransfer;
        e.preventDefault();
        if (e.stopPropagation){
            e.stopPropagation();
        }
        if(t){
            t.dropEffect = 'move';
            return false;
        }
    }

    onDragLeave(el: HTMLElement, data: object, e: DragEvent){
        el.classList.remove('drag-hover');
    }

    onDrop(el: HTMLElement, data: object, e: DragEvent){
        const t = e.dataTransfer;
        console.log(el);
        let current = document.getElementById(this.dragEl);
        if (e.stopPropagation){
            e.stopPropagation();
        }
        if(current){
            // Is the drop happening on the form builder?
            if(el.id === this.wrapper.id){
                let newEl = JSON.parse(JSON.stringify(current));
                newEl.setAttribute('id', (parseInt(newEl.id) + 1).toString() );
                this.wrapper.appendChild(newEl);
            }

            /**
             * This checks if the dropping node is before the node being dropped on
             * if so, it will replace the position
             * Otherwise it will pop after
             * This is a human ui thing... If you are dragging a node up, you expect it to drop in after, not before
             */
            if(current.compareDocumentPosition(el) === 2){
                this.list.insertBefore(current, el);
            }else{
                this.list.insertBefore(current, el.nextSibling);
            }
        }
        this.dragEl = 'no selection';
    }

    onDragEnd(el: HTMLElement, data: object, e: DragEvent){
        el.classList.remove('drag-moving');
    }

    // Add field

    // Remove field

    // Set Values

    // Define BaseModel for all form inputs



}
