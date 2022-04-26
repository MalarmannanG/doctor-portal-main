import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable, of } from "rxjs";
import { map, startWith } from "rxjs/operators";


/**
 * @title Highlight the first autocomplete option
 */
@Component({
    selector: "autocomplete-auto-active",
    templateUrl: "autocomplete-auto-active.component.html",
    styleUrls: ["autocomplete-auto-active.component.css"]
})
export class AutocompleteAutoActiveComponent implements OnInit {
    myControl = new FormControl();
    //dataJson1: any[] = [];
    result: Observable<string[]>;
    @Input() items: any[];
    @Input() label: string;
    @Input() selectedTemplateObjsTemp: any[];
    separatorKeysCodes: number[] = [ENTER, COMMA];
    @Output() onSelect = new EventEmitter<any>();
    @Output() onRemove = new EventEmitter<any>();
    length = 0;

    ngOnChanges(changes: SimpleChanges) {
        this.result = this.myControl.valueChanges.pipe(
            startWith(""),
            map(value => this.find(value))
        );
        
    }
    ngOnInit() {
        this.result = this.myControl.valueChanges.pipe(
            startWith(""),
            map(value => this.find(value))
        );
    }

    onOptionSelected($event: any) {
        let selectedTemplateObj = this.items.filter(a => a.name == $event.option.value)[0];
        var index = this.selectedTemplateObjsTemp.findIndex(x => x.name == $event.option.value);
        console.log(index);
        if (index === -1)
            this.selectedTemplateObjsTemp.push(selectedTemplateObj);
        this.clear();
        this.onSelect.emit($event.option.value);
    }

    clear() {
        this.myControl.setValue(null);
    }
   
    removeChip(removeIndex: number, edit = false) {
        if (edit) {
            var aa = this.selectedTemplateObjsTemp?.filter((a, i) => i == removeIndex)[0];
            this.selectedTemplateObjsTemp = this.selectedTemplateObjsTemp?.filter((a, i) => i != removeIndex);
            this.onRemove.emit(aa?.name);
        }
    }
    mouseDown(trigger)
    {
        trigger.openPanel();
    }
    find(val: string): string[] {
        this.length = 0;
        const matchFound: string[] = [];
        console.log(val);
        if (val != null) {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].name.toLowerCase().startsWith(val) || this.items[i].name.startsWith(val)) {
                    matchFound.push(this.items[i]);
                    this.length++;
                }
            }
        }
        else {
            for (let i = 0; i < this.items.length; i++) {
                matchFound.push(this.items[i]);
                this.length++;
            }
        }
        console.log(this.length);
        return matchFound;
    }
}
