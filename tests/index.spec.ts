import { FormBuilder } from './../src/index';
import { defaultOptions } from './../src/defaultOpts';

describe('#formBuilder', () =>{
    const idName = 'test';
    let testBuilder: CustomObj;

    beforeEach(function() {
        const testDiv = `<div id="${idName}"></div>`;

        document.body.insertAdjacentHTML('afterbegin', testDiv);
        testBuilder = new FormBuilder(idName);
    });

    afterEach(() => {
        document.body.removeChild((document.getElementById(idName) as HTMLElement));
    });

    it('should instantiate based on passed element id', () =>{

        const testEl = document.getElementById(idName);
        const testString = testEl ? testEl.innerHTML : '';

        expect((testBuilder['list'].innerHTML).length).not.toEqual(0);
        expect(testString).toContain(testBuilder['list'].outerHTML);
        expect(testString).toContain(testBuilder['wrapper'].outerHTML);
    })

    it('should not instantiate based on bad element id', () =>{
        const failBuilder = new FormBuilder('wrong');

        expect((failBuilder['list'].innerHTML).length).toEqual(0);
    })

    it('should change position of list items when dragged and dropped', ()=>{
        // All Nodes list of all <li> items
        const options = testBuilder.list.childNodes;
        const li1 = options[0];
        const li2 = options[1];

        // Assert that the first list item is read as the first in the list object
        expect(li1).toEqual(options[0]);

        const dt = new DataTransfer();
        const dragStart = new DragEvent('dragstart', { dataTransfer: dt });
        const drop = new DragEvent('drop');
        li1.dispatchEvent(dragStart);
        li2.dispatchEvent(drop);

        // Assert that the same list item is no longer first in the list object
        expect(li1).not.toEqual(options[0]);

        // // This is no longer blank!  Set in class
        // console.log(dt.getData('text/html'));
    })

    it('should create a new form object when list item dropped in wrapper', ()=>{
        const options = testBuilder.list.childNodes;
        const li1 = options[0];

        console.log((testBuilder.wrapper));
        // const oldLength = (testBuilder.wrapper.innerHTML).length;

        const dt = new DataTransfer();
        const dragStart = new DragEvent('dragstart', { dataTransfer: dt });
        const drop = new DragEvent('drop');

        li1.dispatchEvent(dragStart);
        testBuilder.wrapper.dispatchEvent(drop);

        console.log(testBuilder.wrapper);
    })
})
