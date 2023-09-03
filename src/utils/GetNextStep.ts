import { IDataSet, IStep } from "../interfaces";
import sendNextStep from "./SendNextStep";


const searchStep = (flow : IStep[], find: (step: IStep) => boolean): IStep | null  => {
  for (const step of flow) {
    if (find(step)) {
      return step;
    }
    if (step.action === 'While' && step.params.flow) {
      const data = searchStep(step.params.flow, find);
      if (data) return data;
    }
  }
  return null;
}

export default async ({ step, dataset, flow, SendNextStep }: { step: IStep, dataset: IDataSet, flow: IStep[], SendNextStep: typeof sendNextStep}) => {
    if (step.action === 'ConditionForNextStep') step.nextStep = dataset[step.name];
    if (step.nextStep) {
      const nextStep = searchStep(flow, ({ name }) => step.nextStep === name);
      if (nextStep) { 
       await SendNextStep({nextStep: {...nextStep}, dataset, flow});
      } else {
        console.log(`Fluxo terminou sem encontra o step ${step.nextStep}`);
      }
    } else if (step.parentStep) {
      const nextStep = searchStep(flow, ({ name }) => step.parentStep === name);
      if (nextStep) { 
       await SendNextStep({nextStep: {...nextStep}, dataset, flow});
      } else {
        console.log(`Fluxo terminou sem encontra o parent step ${step.parentStep}`);
      }
    } else {
      console.log('Fluxo terminou');
    }
}