import { FormBuilder } from './../src/index';

describe('#formBuilder', () =>{
    beforeEach(function() {
        const testDiv = `<div id="test"></div>`;

        document.body.insertAdjacentHTML('afterbegin', testDiv);
    });

    afterEach(() => {
        document.body.removeChild((document.getElementById('test') as HTMLElement));
    });

    it('should instantiate based on element id', () =>{
        const testBuilder = new FormBuilder('test');
        console.log(testBuilder['list'].innerHTML);

        expect((testBuilder['list'].innerHTML).length).not.toEqual(0);
    })

    it('should not instantiate based on bad element id', () =>{
        const testBuilder = new FormBuilder('wrong');
        console.log(testBuilder['list'].innerHTML);

        expect((testBuilder['list'].innerHTML).length).toEqual(0);
    })
})
