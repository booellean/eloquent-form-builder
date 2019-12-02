export declare class FormBuilder {
    private base;
    private wrapper;
    private list;
    constructor(element: string, options?: Array<object>);
    createNewFormElement(item: any): Promise<void>;
}
