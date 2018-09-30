import {OneClass, html} from '@alexmtur/one-class'
import {oneStyle} from '@alexmtur/one-style'
//import * as smoothscroll from 'smoothscroll-polyfill';

export class OneDragBox extends OneClass {
    static get properties() {return {
        draggable: Boolean, 
        column: Boolean,
        slectedIndex: Number,
    }}
    constructor() {
        super();  
        this.selectedIndex = 0;
        //smoothscroll.polyfill();
        //console.log(smoothscroll);
    }
    _firstRendered() {
        super._firstRendered();
        let index = 0;
        this.id('content').assignedNodes().map((child) => {
            if(child.nodeName !== '#text') {
                child.setAttribute("id", "page" + index);
                child.setAttribute("class", "page");
                this.id('dragBox').appendChild(child);
                index += 1;
            }
        });
        this.childrenNumber = index;
        this.id('dragBox').removeChild(this.id('content'));
        this.id('page' + this.selectedIndex).scrollIntoView();
        //smoothscroll.polyfill();
        //add touchevents for safari and touchscreens
        //add polyfill for safari scroll smooth;

    }
    next() {
        if(this.selectedIndex < this.childrenNumber - 1)  this.selectedIndex += 1;
        this.id('page' + this.selectedIndex).scrollIntoView({behavior: 'smooth'}); 
    }
    previous() {
        if(this.selectedIndex > 0) this.selectedIndex -= 1;
        this.id('page' + this.selectedIndex).scrollIntoView({behavior: 'smooth'}); 
    }
    setupDrag(e) {
        e.preventDefault();
        this.mousedown = true;
        this.initialX = e.pageX;
        this.initialScrollX = this.id('dragBox').scrollLeft;
        this.scrollDelta = 0;
        //console.log('a');
        return false;

    }
    dragPage(e) {
        if(!this.mousedown) return;
        e.preventDefault();
        this.scrollDelta = this.initialX - e.pageX;
        this.id('dragBox').scrollTo((this.scrollDelta + this.initialScrollX), 0);
        //console.log('b')
    }
    updatePage(e) {
        e.preventDefault();
        if(this.mousedown) {
            let width = this.id('dragBox').offsetWidth;
            if(this.scrollDelta > width / 2.5) this.next();
            else if((-1) * this.scrollDelta > width / 2.5) this.previous();
            else if(Math.abs(this.scrollDelta) > 0)  this.id('page' + this.selectedIndex).scrollIntoView({behavior: 'smooth'});                       
            this.mousedown = false;
        }
        //console.log('c')
    } 
     _render() {
        return html`
        ${oneStyle}
        <style>
            :host {
                display: block;
            }
            #dragBox {
                display: flex;  
                flex-direction: row;              
                width: 100%; 
                overflow-x: hidden;
            }
            .page {
                min-width: 100%;
                max-width: 100%; 
                display: flex;  
                align-items: center;
                justify-dragBox: center;
            }
        </style>

        <div id="dragBox" 
                    @pointerdown=${(e)=>{this.setupDrag(e)}}
                    @pointermove=${(e)=>{this.dragPage(e)}}
                    @pointerup=${(e)=>{this.updatePage(e)}}> 
            <slot id="content" @mousedown=${(e)=>{this.setupDrag(e)}} ></slot>  
        </div>
        `;}
}
customElements.define('one-drag-box', OneDragBox);
