
/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare var tinymce: any;

declare var echarts: any;
interface JQuery {
  draggable(...options: any): any;
  resizable(...options: any): any;
  scroll(...options: any): any;
  datepicker(...options: any): any;
  datetimepicker(...options: any): any;
  timepicker(...options: any): any;
  autocomplete(...options: any): any;
  live(...options: any): any;
}