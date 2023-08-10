import { Controller, Get } from '@nestjs/common';
import { FlowService } from './flow.service';

@Controller()
export class FlowController {
  constructor(private readonly flowService: FlowService) {}

  @Get('/test')
  getHello(): void {
    const base = {
      flow: [
        {
          initFlow: true,
          name: 'GetTickets',
          action: 'HttpRequest',
          params: {
            type: 'GET',
            url: `{{BaseUrl}}/api/v2/tickets`,
            body: {},
            headers: {
              Authorization: '{{Authorization}}',
            },
            params: {
              TESTE: 1,
            },
          },
          response: async (data) => {
            return data.response.tickets;
          },
          nextStep: 'Processando',
        },
        {
          name: 'Processando',
          action: 'While',
          params: {
            iterator: 'GetTickets',
            nameItem: 'ticket',
            flow: [
              {
                initFlow: true,
                name: 'EscolhendoProximaEtapa',
                action: 'ConditionForNextStep',
                params: {
                  nextSteps: [
                    {
                      conditions: [
                        { field: 'ticket.id', operator: 'equal', value: '1' },
                      ],
                      nextStep: 'GetRequester',
                    },
                    {
                      conditions: [
                        {
                          field: 'ticket.id',
                          operator: 'notEqual',
                          value: '1',
                        },
                      ],
                      nextStep: 'GetAssigne',
                    },
                  ],
                },
              },
              {
                name: 'GetRequester',
                action: 'HttpRequest',
                params: {
                  type: 'GET',
                  url: `{{BaseUrl}}/api/v2/users/{{ticket.requester_id}}`,
                  body: {},
                  headers: {
                    Authorization: '{{Authorization}}',
                  },
                  params: {
                    TESTE: 1,
                  },
                },
                response: async ({ response }, { ticket }) => {
                  console.log(
                    'Equal kkkkkkkkkkkkkkkkkkkkkkkk',
                    'ticket é',
                    ticket.id,
                  );
                  return response.ticket;
                },
                nextStep: 'TestAwait',
              },
              {
                name: 'GetAssigne',
                action: 'HttpRequest',
                params: {
                  type: 'GET',
                  url: `{{BaseUrl}}/api/v2/users/{{ticket.requester_id}}`,
                  body: {},
                  headers: {
                    Authorization: '{{Authorization}}',
                  },
                  params: {
                    TESTE: 1,
                  },
                },
                response: async ({ response }, { ticket }) => {
                  console.log(
                    'NotEqual kkkkkkkkkkkkkkkkkkkkkkkk',
                    'ticket é',
                    ticket.id,
                  );
                  return response.ticket;
                },
                nextStep: 'TestAwait',
              },
              {
                name: 'TestAwait',
                action: 'Await',
                params: {
                  time: 2000,
                },
              },
            ],
          },
        },
      ],
      dataSet: {
        Authorization: 'Basic cmVuYXRhbWFnbm9AbGl2ZS5jb206UiYxOTI4Mzc',
        BaseUrl: 'https://d3v-rcm.zendesk.com',
      },
    };
    this.flowService.Exec({ flow: base.flow, newDataSet: base.dataSet });
  }

  @Get('/senior')
  seniorTest(): void {
    const USERNAME = 'sustentacao@aktienow.com';
    const PASSWORD = 'senioraktienow@2022';
    const token = `${USERNAME}:${PASSWORD}`;
    const encodedToken = Buffer.from(token).toString('base64');
    console.log(encodedToken);
    const base = {
      flow: [
        {
          initFlow: true,
          name: 'GetOrganizations',
          action: 'HttpRequest',
          params: {
            type: 'GET',
            url: `{{#if GetOrganizations  }}{{ GetOrganizations.next_page }}{{else}}{{BaseUrl}}/api/v2/organizations{{/if}}`,
            body: {},
            headers: {
              Authorization: '{{Authorization}}',
            },
          },
          response: async (data) => {
            return data.response;
          },
          nextStep: 'Processando',
        },
        {
          name: 'Processando',
          action: 'While',
          params: {
            iterator: 'GetOrganizations.organizations',
            nameItem: 'organization',
            flow: [
              {
                initFlow: true,
                name: 'EscolhendoProximaEtapa',
                action: 'ConditionForNextStep',
                params: {
                  nextSteps: [
                    {
                      conditions: [
                        {
                          field:
                            'organization.organization_fields.controle_gmud',
                          operator: 'equal',
                          value: 'não_controla_gmud',
                        },
                      ],
                      nextStep: 'UpdateOrganization',
                    },
                  ],
                },
              },
              {
                name: 'UpdateOrganization',
                action: 'HttpRequest',
                params: {
                  type: 'PUT',
                  url: `{{BaseUrl}}/api/v2/organizations/{{organization.id}}`,
                  body: {
                    organization: {
                      organization_fields: {
                        controle_gmud: 'gmud_normal',
                      },
                    },
                  },
                  headers: {
                    Authorization: '{{Authorization}}',
                  },
                  params: {
                    TESTE: 1,
                  },
                },
                response: async ({ response }, { organization }) => {
                  console.log(
                    'Antes: ',
                    organization.organization_fields.controle_gmud,
                  );
                  console.log(
                    'Depois: ',
                    response.organization.organization_fields.controle_gmud,
                  );
                  return response.organization;
                },
              },
            ],
          },
          nextStep: 'EscolhendoProximaEtapa',
        },
        {
          name: 'EscolhendoProximaEtapa',
          action: 'ConditionForNextStep',
          params: {
            nextSteps: [
              {
                conditions: [
                  {
                    field: 'GetOrganizations.next_page',
                    operator: 'notEqual',
                    value: null,
                  },
                ],
                nextStep: 'GetOrganizations',
              },
            ],
          },
        },
      ],
      dataSet: {
        Authorization: `Basic c3VzdGVudGFjYW9AYWt0aWVub3cuY29tOnNlbmlvcmFrdGllbm93QDIwMjI`,
        BaseUrl: 'https://cxsenior.zendesk.com',
      },
    };
    this.flowService.Exec({ flow: base.flow, newDataSet: base.dataSet });
  }
}
