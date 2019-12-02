import { defaultOptions } from './defaultOpts';
// import input from './components/input';

export class FormBuilder {
    private base: HTMLElement;
    private wrapper: HTMLElement;
    private list: HTMLElement;

    constructor(element: string, options: Array<object> = defaultOptions){
        // TODO: if there is no element passed, then the application will not work....
        // There must be a better way to clear this check and alert a user if this isn't instantiating
        this.base = document.getElementById(element) || document.createElement('div');
        console.log("I've started");
        this.wrapper = document.createElement('ul');
        this.wrapper.id = 'form-build';

        this.list = document.createElement('ul');
        this.list.id = 'form-options';

        defaultOptions.forEach( item => {
            const li = document.createElement('li');
            li.innerHTML = item.type;
            li.addEventListener('click', () => this.createNewFormElement(item));
            this.list.append(li);
        });

        this.base.append(this.wrapper);
        this.base.append(this.list);
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
    // Add field

    // Remove field

    // Set Values

    // Define BaseModel for all form inputs



}
