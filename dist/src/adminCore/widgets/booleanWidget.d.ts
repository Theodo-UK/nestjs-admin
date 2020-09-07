import { BaseWidget } from './widget.interface';
export default class BooleanWidget extends BaseWidget {
    get template(): "widgets/boolean-nullable.njk" | "widgets/boolean.njk";
    isRequired(): boolean;
}
