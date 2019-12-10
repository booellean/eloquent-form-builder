import { FormBuilder } from './../src/index';

// const global: {[key: string]: any} = {};
// beforeEach(function() {
//     return JSDOM.fromFile('./demo/index.html')
//     .then( dom =>{
//         global.window = dom.window;
//         global.document = window.document;
//     })
// });

describe('#formBuilder', () =>{
    beforeEach(function() {
        const testDiv = `<div id="test"></div>`;

        document.body.insertAdjacentHTML('afterbegin', testDiv);
        // return JSDOM.fromFile('./demo/index.html')
        // .then( dom =>{
        //     global.window = dom.window;
        //     global.document = window.document;
        // })
    });

    afterEach(() => {
        document.body.removeChild((document.getElementById('test') as HTMLElement));
    });

    it('should instantiate based on element id', () =>{
        //This works now!  Now try to get the next one to work
        console.log(document.getElementById('test'));
        console.log(new FormBuilder('test'));
    })
    it('should return an HTML form element and edit box', ()=>{

    })
})
