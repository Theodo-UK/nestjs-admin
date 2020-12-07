import { Injectable, Inject } from '@nestjs/common';
import * as nunjucks from 'nunjucks';
import * as dateFilter from 'nunjucks-date-filter';
import { join } from 'path';
import { Request } from 'express';
import * as filters from './admin.filters';
import DefaultAdminSite from './adminSite';
import { getRelationOptions } from './widgets/utils';
import { isEntityInList } from '../utils/entity';
import { getPaginationRanges, generatePaginatedUrl } from '../utils/pagination';
import { SetAsyncExtension } from './extensions/setAsync';
import { injectionTokens } from '../tokens';
import { isDateType } from '../utils/column';

interface TemplateParameters {
  request: Request;
  [k: string]: any;
}

@Injectable()
class DefaultAdminNunjucksEnvironment {
  env: nunjucks.Environment;

  constructor(
    @Inject(injectionTokens.ADMIN_SITE)
    private adminSite: DefaultAdminSite,
  ) {
    // Configure nunjucks for the admin
    this.env = nunjucks.configure(join(__dirname, '..', 'public', 'views'), {
      noCache: true,
    });

    this.env.addExtension('SetAsyncExtension', new SetAsyncExtension());

    dateFilter.setDefaultFormat(adminSite.defaultDateFormat);
    this.env.addFilter('date', dateFilter);
    this.env.addFilter('adminUrl', filters.adminUrl);
    this.env.addFilter('prettyPrint', filters.prettyPrint);
    this.env.addFilter('displayName', filters.displayName);

    this.env.addGlobal('adminSite', adminSite);
    this.env.addGlobal('getRelationOptions', getRelationOptions); // Meh name
    this.env.addGlobal('isEntityInList', isEntityInList);
    this.env.addGlobal('getPaginationRanges', getPaginationRanges);
    this.env.addGlobal('generatePaginatedUrl', generatePaginatedUrl);
    this.env.addGlobal('isDateType', isDateType);
  }

  async render(name: string, parameters: TemplateParameters) {
    const templateParameters = {
      ...parameters,
      messages: parameters.request.flash('messages'),
      flash: parameters.request.flash(),
    };

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
    const rendered = await prom;
    return rendered;
  }
}

export default DefaultAdminNunjucksEnvironment;
