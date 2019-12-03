export declare class FormBuilder {
    private base;
    private wrapper;
    private list;
    private dragEl;
    protected formData: Array<object>;
    constructor(element: string, options?: Array<object>);
    createNewFormElement(item: any): Promise<void>;
    /**
     * Code Partially derived from Shayna Lekohmaher
     * https://codepen.io/lorelea/pen/WRqQyy
     * Visited 12/2/2019
     */
    onDragStart(el: HTMLElement, data: object, e: DragEvent): void;
    onDragEnter(el: HTMLElement, data: object, e: DragEvent): void;
    onDragOver(el: HTMLElement, data: object, e: DragEvent): false | undefined;
    onDragLeave(el: HTMLElement, data: object, e: DragEvent): void;
    onDrop(el: HTMLElement, data: object, e: DragEvent): void;
    onDragEnd(el: HTMLElement, data: object, e: DragEvent): void;
}
