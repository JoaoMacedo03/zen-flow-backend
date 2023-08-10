import { Injectable } from '@nestjs/common';
import { AwaitActionService } from 'src/actions/Await/await.service';
import { ConditionForNextStepService } from 'src/actions/ConditionForNextStep/ConditionForNextStep.service';
import { WhileActionService } from 'src/actions/While/while.service';
import { HttpActionService } from 'src/actions/http/http.service';
import { convertBars } from 'src/utils/handleBars';
interface IResponseActionHttpRequest {
  status: number;
  headers: { [n: string]: any };
  response: any;
}

interface IParams {
  [n: string]: string | number | null | IParams;
}
@Injectable()
export class FlowService {
  constructor(
    private htpActionService: HttpActionService,
    private whileActionService: WhileActionService,
    private awaitActionService: AwaitActionService,
    private conditionForNextStepService: ConditionForNextStepService,
  ) {}

  GetAction(typeAction: string) {
    const actions = {
      HttpRequest: this.htpActionService.action.bind(this.htpActionService),
      While: this.whileActionService.action.bind(this.whileActionService),
      Await: this.awaitActionService.action.bind(this.awaitActionService),
      ConditionForNextStep: this.conditionForNextStepService.action.bind(
        this.conditionForNextStepService,
      ),
    };
    return actions[typeAction];
  }

  prepareParams(params: IParams, dataset: any): IParams {
    const newParams = Array.isArray(params) ? [...params] : { ...params };
    for (const key in newParams) {
      if (newParams.hasOwnProperty(key)) {
        const value = newParams[key];
        if (key === 'flow') {
          newParams[key] = value;
          continue;
        }
        if (typeof value === 'object' && value !== null) {
          newParams[key] = this.prepareParams(value, dataset);
        } else {
          newParams[key] =
            typeof value === 'string' ? convertBars(dataset, value) : value;
        }
      }
    }
    return newParams as any;
  }

  async Exec({
    newDataSet,
    data,
    nameData,
    flow,
  }: {
    newDataSet?: any;
    data?: any;
    nameData?: string;
    flow: any;
  }) {
    console.log(
      '=====================================Iniciando fluxo==========================================',
    );
    const dataSet = newDataSet || {};
    if (nameData) {
      // inicia o fluxo com preencendo o dataset
      dataSet[nameData] = data;
    }

    const StepInit = flow.find(({ initFlow }) => initFlow);
    if (StepInit) {
      await this.ExecStep(StepInit, dataSet, flow);
    }
    console.log(
      '=====================================Terminou================================================',
    );
    return dataSet;
  }

  async ExecStep(step: any, dataSet: { [n: string]: any }, flow: any) {
    console.log(`Processando etapa ${step.name}`);
    const action = this.GetAction(step.action);
    if (!action) {
      console.log(`Ação não encontrada ${step.action}!`);
      return;
    }
    const responseAction = await action(
      this.prepareParams(step.params, dataSet),
      this.Exec.bind(this),
      dataSet,
    );
    if (step.response) {
      const responseStep = await step.response(responseAction, dataSet);
      dataSet[step.name] = responseStep;
    }

    //  TODO - SPLIT - NEW FUCTION
    if (step.action === 'ConditionForNextStep') step.nextStep = responseAction;
    if (step.nextStep) {
      const nextStep = flow.find(({ name }) => step.nextStep === name);
      if (nextStep) {
        await this.ExecStep(nextStep, dataSet, flow);
      } else {
        console.log(`Fluxo terminou sem encontra o step ${step.nextStep}`);
      }
    } else {
      //console.log('Fluxo terminou');
    }
  }
}
