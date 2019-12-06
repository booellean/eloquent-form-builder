import { defaultOptions } from './defaultOpts';
const Styles = require('./styles.scss');

export class FormBuilder {
    private base: HTMLElement;
    private wrapper: HTMLElement;
    private list: HTMLElement;
    private dragEl: string;
    private dragDat: object;
    protected formData: Array<object>;

    constructor(element: string, options: Array<object> = defaultOptions){
        // TODO: if there is no element passed, then the application will not work....
        // There must be a better way to clear this check and alert a user if this isn't instantiating
        this.base = document.getElementById(element) || document.createElement('div');
        this.base.classList.add('form-wrapper');
        this.wrapper = document.createElement('ul');
        this.formData = [];
        this.dragEl = 'no selection';
        this.dragDat = {};

        this.wrapper.id = 'form-build';

        this.list = document.createElement('ul');
        this.list.id = 'form-options';

        defaultOptions.forEach( (item, index) => {
            const li = document.createElement('li');
            li.innerHTML = item.name;
            li.className = 'form-option';
            li.id = index.toString();

            // Add event listeners for list item... creates drag and drop functionality and creating new form block
            li.addEventListener('click', () => this.createNewFormElement(item));

            this.attachDragEvents(li, item, this.list);
            this.list.append(li);
        });

        this.wrapper.addEventListener('dragover', (e: DragEvent) => this.onDragOver(this.wrapper, e), false);
        this.wrapper.addEventListener('drop', (e: DragEvent) => this.onDrop(this.wrapper, this.wrapper, e), false);

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

        return new plug[constructorName](item);
    }

    attachDragEvents(li:HTMLElement, item: object, list: HTMLElement){
        li.setAttribute('draggable', 'true');
        li.addEventListener('dragstart', (e: DragEvent) => this.onDragStart(li, item, e), false);
        li.addEventListener('dragenter', (e: DragEvent) => this.onDragEnter(li, e), false);
        li.addEventListener('dragover', (e: DragEvent) => this.onDragOver(li, e), false);
        li.addEventListener('dragleave', (e: DragEvent) => this.onDragLeave(li, e), false);
        li.addEventListener('drop', (e: DragEvent) => this.onDrop(li, list, e), false);
        li.addEventListener('dragend', (e: DragEvent) => this.onDragEnd(li, e), false);
    }

    // Drag and Drop Events
    /**
     * Code Partially derived from Shayna Lekohmaher
     * https://codepen.io/lorelea/pen/WRqQyy
     * Visited 12/2/2019
     */

    onDragStart(el: HTMLElement, data: object, e: DragEvent){
        const t = e.dataTransfer;
        if (e.stopPropagation){
            e.stopPropagation();
        }
        this.dragEl = el.id;
        this.dragDat = data;
        el.classList.add('drag-moving'); // muted colors, this is moving

        //Create a custom image and override the default!
        if(t){
            let previous = document.getElementById('drag-placeholder');
            if(previous){
                //Remove any previous placeholders hanging out in space
                document.body.removeChild(previous);
            }

            const dragImg: HTMLElement = document.createElement('li');
            dragImg.id = 'drag-placeholder';
            dragImg.innerHTML = el.innerHTML;
            dragImg.className = el.className;
            // Need these custom stylings to prevent drag image issues
            dragImg.style.position = "fixed";
            dragImg.style.bottom = "-1000px";
            dragImg.style.left = "-1000px";
            dragImg.style.width = `${el.clientWidth}px`;
            dragImg.style.height = `${el.clientHeight}px`;
            document.body.appendChild(dragImg);
            t.setDragImage(dragImg, e.offsetX, e.offsetY);
        }
    }

    onDragEnter(el: HTMLElement, e: DragEvent){
        if (e.stopPropagation){
            e.stopPropagation();
        }
        el.classList.add('drag-hover'); // highlighted colors. This may be moved
        e.preventDefault();
    }

    onDragOver(el: HTMLElement, e: DragEvent){
        e.preventDefault();
        if (e.stopPropagation){
            e.stopPropagation();
        }
        // TODO: Add a hovering class name?
    }

    onDragLeave(el: HTMLElement, e: DragEvent){
        if (e.stopPropagation){
            e.stopPropagation();
        }
        el.classList.remove('drag-hover');
    }

    async onDrop(el: HTMLElement, list: HTMLElement, e: DragEvent){
        if (e.stopPropagation){
            e.stopPropagation();
        }
        let current = document.getElementById(this.dragEl);
        if (e.stopPropagation){
            e.stopPropagation();
        }
        if(current){
            // Is the drop happening on the form builder?
            if(el.id === list.id && Object.entries(this.dragDat).length !== 0){
                const elementObj = await this.createNewFormElement(this.dragDat);
                const newEl = elementObj.formElementData;
                // This allows for nodes to be delted when the x button is clicked.
                // TODO: add obj data to master here,
                elementObj.emitter.on('deletenode', () =>{
                    console.log(elementObj);
                    this.wrapper.removeChild(newEl);
                })
                // TODO: This is not working as expected? They will not realign
                this.attachDragEvents(newEl, {}, list);
                return this.wrapper.appendChild(newEl);
            }

            // If the current list item is from another list, DO NOT append...
            // TODO: What behaviors should take place? Remove the nodes?
            if(el.parentNode !== current.parentNode){
                return;
            }

            /**
             * This checks if the dropping node is before the node being dropped on
             * if so, it will replace the position
             * Otherwise it will pop after
             * This is a human ui thing... If you are dragging a node up, you expect it to drop in after, not before
             */
            if(current.compareDocumentPosition(el) === 2){
                list.insertBefore(current, el);
            }else{
                list.insertBefore(current, el.nextSibling);
            }
        }
        this.dragEl = 'no selection';
        this.dragDat = {};
    }

    onDragEnd(el: HTMLElement, e: DragEvent){
        if (e.stopPropagation){
            e.stopPropagation();
        }
        el.classList.remove('drag-moving');
        this.dragEl = 'no selection';
        this.dragDat = {};
    }

    // Add field

    // Remove field

    // Set Values

    // Define BaseModel for all form inputs

    // This renders the form data in a way for Laravel's Eloquent Form's Model to read. Please make edits for your specific Project's Purposes

}
