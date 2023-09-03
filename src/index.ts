import { IDataSet, IStep, TActions } from "./interfaces";
import GetAction from "./utils/GetAction";
import GetNextStep from "./utils/GetNextStep";
import PrepareParams from "./utils/PreparaParams";
import SendNextStep from "./utils/SendNextStep";

export const handler = async (event: { step: IStep, dataset: IDataSet, flow: IStep[] }) => {
    if (!event || event.step.name === event.step.nextStep) {
      console.log('event.body', event);
      return {
        statusCode: 500,
        body: 'Error payload or loop',
      };
    }
    let { step, dataset, flow } = event;
    console.log('Init fuction:', step.name);
    const action = GetAction(step.action as TActions);
    try {
        step.params =  PrepareParams(step.params, dataset);
        const data = await action({ step: step as any, dataset, flow, updateFlow: (newflow: any) => flow = newflow, updateDataset: (newDataset: any) => dataset = newDataset });
        dataset[step.name] = data;
        await GetNextStep({ step, dataset, flow, SendNextStep });
        return { response: data, dataset };
    } catch (e) {
        console.log(e)
        return { response: e, dataset };
    }
};
