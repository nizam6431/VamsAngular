import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { ThemeService } from "./theme.service";

declare var document: any;

@Injectable({ providedIn: 'root' })
export class ScriptService {

    constructor(private themeService: ThemeService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    loadScript(src: string, scriptId: any, callback: any) {
        //load script
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = scriptId;
        script.src = src;
        if (script.readyState) {  //IE
            script.onreadystatechange = () => {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {  //Others
            script.onload = () => {
                callback();
            };
        }
        script.onerror = (error: any) => 
        { 
            alert("Company data not found.");
            this.router.navigate(['error']);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    }
}