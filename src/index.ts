import { defaults } from './defaults';
// import * as Polyfill from './polyfill.js';
require('./styles.scss');
// import input from './components/input';

const elements : CustomObj = {
    'input' : require('./components/input')
}

export class FormBuilder {
    // private base: HTMLElement;
    private wrapper: HTMLUListElement = document.createElement('ul');
    private list: HTMLElement = document.createElement('ul');
    private dragEl: string = 'no selection';
    private dragDat: object = {};
    protected formData: Array<CustomObj> = [];

    constructor(element: string, extend: CustomObj = {}){
        // TODO: Inject polyfills into head

        const base = document.getElementById(element);

        // The following below will override default values with the options a user passes in
        // This is the easiest way to gaurantee options while allowing overrides, similar to Froala instantiation pattern
        Object.keys(extend).forEach( key =>{
            Object.defineProperty(defaults, key, {
                value: extend[key],
                writable: true
            })
        })

        // If there is no base, return and end all operations
        if(!base){
            this.dragEl = 'Exit Function';
            console.log("Check the id of the element you passed!");
            return;
        }

        base.classList.add('form-wrapper');
        base.innerHTML = '';

        this.wrapper.id = 'form-build';
        this.list.id = 'form-options';

        defaults.options.forEach( (item: any, index: any) => {
            const li = document.createElement('li');
            li.innerHTML = item.name;
            li.className = 'form-option';
            li.id = index.toString();
            li.setAttribute('data-name', item.type);

            // Add event listeners for list item... creates drag and drop functionality and creating new form block
            li.addEventListener('click', () => this.createNewFormElement(item));

            this.attachDragEvents(li, item, this.list);
            this.list.appendChild(li);
        });

        this.wrapper.addEventListener('dragover', (e: DragEvent) => this.onDragOver(this.wrapper, e), false);
        this.wrapper.addEventListener('drop', (e: DragEvent) => this.onDrop(this.wrapper, this.wrapper, e), false);

        // Attach a Mutation Observer to observe changes of Form element order form user
        const observer = new MutationObserver( (mutations) =>{
            mutations.forEach( mutation =>{
                /**
                 * NOTE: Every time the ul wrapper has elements added, deleted, or moved, the array is resorted.
                 * It relies on finding the index of the childnodes, which will match our platform property in our objects
                 * It's a little confusing, but this is a quick, one stop shop for guaranteeing the array order will always match the order in the UI
                 */

                this.formData.sort( (a: CustomObj, b: CustomObj) =>{
                    if(Array.prototype.slice.call(this.wrapper.childNodes).indexOf(a.platform) > Array.prototype.slice.call(this.wrapper.childNodes).indexOf(b.platform)){
                        return 1;
                    }else{
                        return -1;
                    };
                })
            })
        })

        observer.observe(this.wrapper, {
            subtree: true,
            childList: true  // For changes to the Label's innerHTML
        })

        base.appendChild(this.list);
        base.appendChild(this.wrapper);
    }

    // TODO: build on methods
    // Inherit for each form element prior to instantiation

    createNewFormElement(item: any){
        let name = item.type;

        // NOTE: The class names are going to coincide with the item.type, so BE CAUTIOUS WHEN CHANGING CLASS NAMES OR TYPES

        // All Usable form elements are loaded at start of application in the 'elements' object
        // These can be used to insantiate new objects from the classes using the constructor
        // The constructor resides in the "default" key, hence the nested object we see below
        // NOTE: I would not mess with this code personally, try to make all needed changes between the class constructors themselves

        return new elements[name]['default'](item);
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

    attachObjectWatchers(){

    }

    /**
     * Drag and Drop Events Code Partially derived from Shayna Lekohmaher
     * https://codepen.io/lorelea/pen/WRqQyy
     * Visited 12/2/2019
     *
     * Please note, that even though this code does not transfer data to make changes
     * it still needs to setData() and effectAllowed to work in Firefox
     */

    onDragStart(el: HTMLElement, data: object, e: DragEvent){
        const t = e.dataTransfer;
        if (e.stopPropagation){
            e.stopPropagation();
        }
        this.dragEl = el.id;
        this.dragDat = data;
        el.classList.add('drag-moving'); // NOTE: muted colors, this is moving

        //Create a custom image and override the default!
        if(t){
            t.effectAllowed = 'move';
            t.setData('text/html', el.innerHTML);

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
            dragImg.style.position = "absolute";
            dragImg.style.bottom = "-1000000x";
            dragImg.style.left = "-1000000px";
            dragImg.style.zIndex = '5000';
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
        const t = e.dataTransfer;
        e.preventDefault();
        if (e.stopPropagation){
            e.stopPropagation();
        }
        if(t){
            t.dropEffect = 'move';
        }
        // TODO: Add a hovering class name?
    }

    onDragLeave(el: HTMLElement, e: DragEvent){
        if (e.stopPropagation){
            e.stopPropagation();
        }
        el.classList.remove('drag-hover');
    }

    onDrop(el: HTMLElement, list: HTMLElement, e: DragEvent){
        if (e.stopPropagation){
            e.stopPropagation();
        }
        let current = document.getElementById(this.dragEl);
        if (e.stopPropagation){
            e.stopPropagation();
        }
        if(current){
            // Is the drop happening on the form builder?
            if(el.id === list.id && Object.keys(this.dragDat).length !== 0){
                const elementObj = this.createNewFormElement(this.dragDat);
                const newEl = elementObj.formElementData;

                // This allows for nodes to be deleted when the x button is clicked.
                // TODO: add obj data to master here,
                this.formData.push( elementObj );
                elementObj.emitter.on('deletenode', () =>{
                    // NOTE: If you use the index method, Two nodes will be deleted due to the reordering function
                    this.formData = this.formData.filter( (item) =>  item.platform !== elementObj.platform );
                    this.wrapper.removeChild(newEl);
                })
                this.attachDragEvents(newEl, {}, list);
                this.wrapper.appendChild(newEl);
                return;
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

    // This renders the form data in a way for Laravel's Eloquent Form's Model to read. Please make edits for your specific Project's Purposes

}
