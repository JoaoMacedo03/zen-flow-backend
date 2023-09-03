import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { IDataSet, IStep, TActions } from "../interfaces";
import { handler } from "..";

export default async ({ nextStep, dataset, flow,  }: { nextStep: IStep, dataset: IDataSet, flow: IStep[]}) => {
    // test local
    // await handler({ step: nextStep, dataset, flow,  });
    // return true;
    const region = 'sa-east-1';
    const lambdaClient = new LambdaClient({ region });
    const invokeParams = {
        FunctionName: 'Ipaas',
        InvocationType: 'Event',
        Payload: JSON.stringify({ step:nextStep, dataset, flow,  })
    };
    const response = await lambdaClient.send(new InvokeCommand(invokeParams));
    if (response.$metadata.httpStatusCode === 202) {
        console.log('Solicitação de invocação enviada com sucesso');
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Solicitação de invocação enviada com sucesso' })
        };
    } else {
        console.error('Erro ao enviar a solicitação de invocação');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao enviar a solicitação de invocação' })
        };
    }
}
