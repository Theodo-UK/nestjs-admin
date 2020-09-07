"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const nunjucks = require("nunjucks");
const dateFilter = require("nunjucks-date-filter");
const path_1 = require("path");
const filters = require("./admin.filters");
const adminSite_1 = require("./adminSite");
const utils_1 = require("./widgets/utils");
const entity_1 = require("../utils/entity");
const pagination_1 = require("../utils/pagination");
const setAsync_1 = require("./extensions/setAsync");
const tokens_1 = require("../tokens");
const column_1 = require("../utils/column");
let DefaultAdminNunjucksEnvironment = class DefaultAdminNunjucksEnvironment {
    constructor(adminSite) {
        this.adminSite = adminSite;
        this.env = nunjucks.configure(path_1.join(__dirname, '..', 'public', 'views'), {
            noCache: true,
        });
        this.env.addExtension('SetAsyncExtension', new setAsync_1.SetAsyncExtension());
        dateFilter.setDefaultFormat(adminSite.defaultDateFormat);
        this.env.addFilter('date', dateFilter);
        this.env.addFilter('adminUrl', filters.adminUrl);
        this.env.addFilter('prettyPrint', filters.prettyPrint);
        this.env.addFilter('displayName', filters.displayName);
        this.env.addGlobal('adminSite', adminSite);
        this.env.addGlobal('getRelationOptions', utils_1.getRelationOptions);
        this.env.addGlobal('isEntityInList', entity_1.isEntityInList);
        this.env.addGlobal('getPaginationRanges', pagination_1.getPaginationRanges);
        this.env.addGlobal('generatePaginatedUrl', pagination_1.generatePaginatedUrl);
        this.env.addGlobal('isDateType', column_1.isDateType);
    }
    render(name, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            const templateParameters = Object.assign(Object.assign({}, parameters), { messages: parameters.request.flash('messages'), flash: parameters.request.flash() });
            const prom = new Promise((resolve, reject) => {
                this.env.render(name, templateParameters, function (err, res) {
                    if (err) {
                        reject(err);
                        return err;
                    }
                    resolve(res);
                    return res;
                });
            });
            const rendered = yield prom;
            return rendered;
        });
    }
};
DefaultAdminNunjucksEnvironment = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(tokens_1.injectionTokens.ADMIN_SITE)),
    __metadata("design:paramtypes", [adminSite_1.default])
], DefaultAdminNunjucksEnvironment);
exports.default = DefaultAdminNunjucksEnvironment;
//# sourceMappingURL=admin.environment.js.map