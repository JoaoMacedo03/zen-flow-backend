import { IOptionsAction, IParamsWhile, IStep } from "../interfaces";
import GetObject from "../utils/GetObject";

export class While {
  static searchStepAndUpdate(flow : IStep[], find: (step: IStep) => boolean, change:(step: IStep<any>) => IStep<any> ): IStep[]  {
    const newFlow: IStep[] = [];
    for (const step of flow) {
      if (find(step)) {
        newFlow.push(change(step))
        continue;
      }
      if (step.action === 'While' && step.params.flow) {
        step.params.flow = this.searchStepAndUpdate(step.params.flow, find, change);
        newFlow.push(step)
        continue;
      }
      newFlow.push(step)

    }
    return newFlow
  }

  static actions ({ step, flow, updateFlow, dataset, updateDataset }: IOptionsAction<IParamsWhile>) {
    const { object, nameIterator } = step.params;
    const objects = GetObject(dataset, object);

    if (!Array.isArray(objects)) {
        throw {
            message: `Variable "${object}" is not array`,
        };
    }

    const length = objects.length;
    const firstIteration = dataset[`_${step.name}_index`] === undefined;
    const lastIteration = length === dataset[`_${step.name}_index`]+1;

    // para o while
    if (lastIteration) {
      flow = this.searchStepAndUpdate(flow,({ name }) => name === step.name && step.action === 'While', (stepChange) => {  
         stepChange.nextStep = step.nextStepDefault;
         step.nextStep = step.nextStepDefault;
         delete step.nextStepDefault;
         return step;
      });
      delete dataset[`_${step.name}_index`];
      delete dataset[nameIterator];
      updateFlow(flow);
      updateDataset(dataset);
      return  'complete'
    };

    // responsavel por add o nome do step pai e alterar o nextStep 
    const changeStepAddNameOfParentStep = (stepChange: IStep<IParamsWhile>): IStep<IParamsWhile> => {
        if (firstIteration) stepChange.nextStepDefault = stepChange.nextStep;
        stepChange.nextStep = stepChange.params.flow?.find(({ initFlow }) => initFlow)?.name
        step.nextStep = stepChange.params.flow?.find(({ initFlow }) => initFlow)?.name
        stepChange.params.flow = stepChange.params.flow?.map((stepF) => ({ ...stepF, parentStep: step.name}));
        return stepChange;
    };

    flow = this.searchStepAndUpdate(flow,({ name }) => name === step.name && step.action === 'While', changeStepAddNameOfParentStep);

    if (firstIteration) dataset[`_${step.name}_index`] = -1;
    dataset[`_${step.name}_index`] += 1;
    dataset[nameIterator] = objects[dataset[`_${step.name}_index`]];

    updateFlow(flow);
    updateDataset(dataset);
  }

}