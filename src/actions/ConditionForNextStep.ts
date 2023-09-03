import { IOptionsAction } from '../interfaces';
import GetObject from '../utils/GetObject';


interface condition { field: string, operator: string, value: string }
export class ConditionForNextStep {
  static ExecCondition({ field, operator, value }: condition) {
    if (operator === 'equal') {
      return field == value;
    }
    if (operator === 'notEqual') {
      return field != value;
    }
    return false;
  }

  static async action({ step, dataset }: IOptionsAction<{ nextSteps : { conditions: condition[], nextStep: string }[]}>): Promise<any> {
    for (const { conditions, nextStep } of step.params.nextSteps) {
      const result = conditions.every(({ field, operator, value }) => {
        const newField = GetObject(dataset, field);
        const newValue = GetObject(dataset, value);
        return this.ExecCondition({
          field: newField,
          operator,
          value: newValue,
        });
      });
      if (result) {
        return nextStep;
      }
    }
    return null;
  }
}
