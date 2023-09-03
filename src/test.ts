import { handler } from ".";

// para realizar teste local remova os comentarios das linhas 7 e 8 do arquivo SendNextStep

const event = {
  "dataset": {
    "Authorization": "Basic cnJkc2RldmVsb3BlcnNAZ21haWwuY29tOkZpbGgwTWV1",
    "BaseUrl": "https://d3v-rrds.zendesk.com"
  },
  "step": {
    "initFlow": true,
    "name": "GetTickets",
    "action": "HttpRequest",
    "params": {
      "method": "GET",
      "url": "{{BaseUrl}}/api/v2/search?query=type:ticket test flow ipaas",
      "headers": {
        "Authorization": "{{Authorization}}"
      }
    },
    "nextStep": "Process"
  },
  "flow": [
    {
      "name": "Process",
      "action": "While",
      "params": {
        "object": "GetTickets.response.results",
        "nameIterator": "Ticket",
        "flow": [
          {
            "initFlow": true,
            "name": "UpdateTicket",
            "action": "HttpRequest",
            "params": {
              "method": "PUT",
              "url": "{{BaseUrl}}/api/v2/tickets/{{Ticket.id}}",
              "data": {
                "ticket": {
                  "comment": {
                    "body": "Helo word while 3 concluido:{{ 'now' | date: '%Y-%m-%d %H:%M:%S:%L' }}",
                    "public": false
                  }
                }
              },
              "headers": {
                "Authorization": "{{Authorization}}"
              }
            }
          }
        ]
      },
      "nextStep": "CheckStatus2"
    },
    {
      "name": "CheckStatus2",
      "action": "HttpRequest",
      "params": {
        "method": "PUT",
        "url": "{{BaseUrl}}/api/v2/tickets/2526",
        "data": {
          "ticket": {
            "comment": {
              "body": "Helo word while 3 concluido:{{ 'now' | date: '%Y-%m-%d %H:%M:%S:%L' }}",
              "public": false
            }
          }
        },
        "headers": {
          "Authorization": "{{Authorization}}"
        }
      }
    }
  ]
}
  handler(event as any);
  