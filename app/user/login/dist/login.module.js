"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LoginPageModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var angular_1 = require("@ionic/angular");
var login_routing_module_1 = require("./login-routing.module");
var login_page_1 = require("./login.page");
var ngx_intl_tel_input_1 = require("ngx-intl-tel-input");
var LoginPageModule = /** @class */ (function () {
    function LoginPageModule() {
    }
    LoginPageModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                angular_1.IonicModule,
                login_routing_module_1.LoginPageRoutingModule,
                ngx_intl_tel_input_1.NgxIntlTelInputModule,
            ],
            declarations: [login_page_1.LoginPage]
        })
    ], LoginPageModule);
    return LoginPageModule;
}());
exports.LoginPageModule = LoginPageModule;
