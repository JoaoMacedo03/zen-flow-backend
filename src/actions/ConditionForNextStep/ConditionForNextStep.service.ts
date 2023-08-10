import { Injectable } from '@nestjs/common';
import { GetObject } from 'src/utils/GetObject';

@Injectable()
export class ConditionForNextStepService {
  ExecCondition({ field, operator, value }) {
    if (operator === 'equal') {
      return field == value;
    }
    if (operator === 'notEqual') {
      return field != value;
    }
    return false;
  }

  async action({ nextSteps }, exec, dataSet): Promise<any> {
    for (const { conditions, nextStep } of nextSteps) {
      const result = conditions.every(({ field, operator, value }) => {
        const newField = GetObject(dataSet, field);
        const newValue = GetObject(dataSet, value);
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
