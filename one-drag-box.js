import {OneClass, html} from '@alexmtur/one-class'
import {oneStyle} from '@alexmtur/one-style'

export class OneDragBox extends OneClass {
    static get properties() {return {
        hour: {type: Number, public: true},     //0 - 23 
        minute: {type: Number, public: true},   //0 - 59 
        hourString: {type: String, public: true},     //0 - 23 
        minuteString: {type: String, public: true},   //0 - 59 
        amPm: {type: String, public: true},     //am - pm
    }}
    constructor() {
        super();  
    }
    _firstRendered() {
        super._firstRendered();
        
        //this.id('clockPage' + this.amPm).scrollIntoView();
    }
    setupDrag(e) {
        e.preventDefault();
        this.mousedown = true;
        this.initialX = e.pageX;
        this.initialScrollX = this.id('hourPanel').scrollLeft;
        this.scrollDelta = 0;
        return false;
    }
    dragPage(e) {
        if(!this.mousedown) return;
        e.preventDefault();
        this.scrollDelta = this.initialX - e.pageX;
        this.id('hourPanel').scrollTo((this.scrollDelta + this.initialScrollX), 0);
    }
    updatePage(e) {
        e.preventDefault();
        if(this.mousedown) {
            let width = this.id('hourPanel').offsetWidth;
            if(this.scrollDelta > width / 2.5 && this.amPm === 'am') {
                this.selectAmPm('pm');
            }
            else if((-1) * this.scrollDelta > width / 2.5 && this.amPm === 'pm') { 
                this.selectAmPm('am');
            }
            else if(Math.abs(this.scrollDelta) > 0) 
                this.id('clockPage' + this.amPm).scrollIntoView({behavior: 'smooth'});           
            this.mousedown = false;
        }
    } 

     _render() {
        return html`
        ${oneStyle}
        <style>
            /* local DOM styles go here */
            :host {
                display: block;
                color: #333;              
            }
            #digitalText {
                font-family: Digital !important;
                font-size: 430%;
            }
            #clock {
                display: flex;  
                flex-direction: column;              
                width: 100%; 
                max-width: 500px;
                min-width: 200px;
                flex: initial;
                flex-shrink: 1;
                flex-grow: 0;
            }
            #clockHeader {
                display: flex;  
                align-items: center;
                justify-content: space-between;              
            }
            #clockBody {
                position: relative;
                width: 100%; 
                display: flex; 
            }
            #hourPanel, #minutePanel {
                width: 100%; 
                overflow-x: hidden;
                display: flex; 
                box-shadow: 0 2px 7px rgba(0, 0, 0, 0.25);
            }
            #amPm {
                box-shadow: 0 2px 7px rgba(0, 0, 0, 0.25);
                margin-bottom: 10px;
                display: flex;
                max-width: 150px;              
            }
            .amPmButton {
                font-size: 120%;
                cursor: pointer;
                padding: 10px;
                color: #bbb;
                flex: 1;
               
            }
            .amPmButton[selected=true] {
                color: white;
                background: var(--one-color, #333);
            }
            .blink {
                animation: blink 1s step-start 0s infinite;
            }
            @keyframes blink {
              50% {
                opacity: 0;
              }
            }
            .clockPage { 
                min-width: 100%;  
                display: flex;                 
                z-index: 0;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
            }
            .cell {
                width:25%;
                height: 8vh;
                -webkit-transition: background .5s ease;
                -moz-transition: background .5s ease;
                border-radius: 100%;
                cursor: pointer;
                display: flex;                 
                justify-content: center;
                align-items: center;
            }            
            .cell[selected=true] .time, .time:hover {
                background: var(--one-color, #333);
                color: white;
            }  
            .cell:hover {
                opacity: 0.5;                
            } 
            .cell:active {
                opacity: 1
            }                     
            .cell[currentMonth=false] .time {
                color: #bbb;
            }
            .time {
                width: 6vh;
                height: 6vh;
                border-radius: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            #dots {
                display: flex; 
                align-items: center; 
                justify-content: center; 
                flex-direction: column;
            }
            .dot {
                height: 8px; 
                width: 8px; 
                background: var(--one-color, #333); 
                margin:10px; 
                border-radius: 0%;
            }
            #hourText {
                height: 100%;
                width: 100%;
                
                position: absolute;
                font-size: 20vh;
                font-family: Digital !important;
                font-weight: normal;
                font-style: normal;
                opacity: 0.3;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                transform: scaleX(0.5);
            }

        </style>

        <div id="clock"> 
            <div id="clockBody">              
                <div id="hourPanel" 
                    @mousedown=${(e)=>{this.setupDrag(e)}}    
                    @mousemove=${(e)=>{this.dragPage(e)}}
                    @mouseup=${(e)=>{this.updatePage(e)}}>
                    <slot></slot>           
                </div> 
            </div>   
        </div>
        `;}
}
customElements.define('one-drag-box', OneDragBox);


