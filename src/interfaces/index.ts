

export type TActions = 'HttpRequest' | 'ConditionForNextStep' | 'While';

export interface IStep  <T = { [n: string]: any }>{
    initFlow?: boolean,
    name: string,
    action: TActions,
    params: T,
    nextStepDefault?: string,
    nextStep?: string,
    parentStep?: string,
}

export interface IDataSet  { [n: string]: any}

export interface IOptionsAction <T = { [n: string]: any }>{
    step: IStep<T>;
    dataset: { [n: string]: any };
    updateFlow: (data: any) => void;
    updateDataset: (data: any) => void;
    flow: IStep[];
}

export interface IParamsWhile { object: string, nameIterator: string, flow: IStep[] }