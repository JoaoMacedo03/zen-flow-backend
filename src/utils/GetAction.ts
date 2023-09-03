import { ConditionForNextStep } from "../actions/ConditionForNextStep";
import { Http } from "../actions/Http";
import { While } from "../actions/While";
import { TActions } from "../interfaces";
const actionsTypes = ['HttpRequest' , 'ConditionForNextStep', 'While']

const GetAction = (typeAction: TActions) => {
    if(!actionsTypes.includes(typeAction)) {
        throw {
        statusCode: 500,
        body: `Error action "${typeAction}" not found`,
      } 
    };
    const actions = {
      HttpRequest: Http.action.bind(Http),
      ConditionForNextStep: ConditionForNextStep.action.bind(ConditionForNextStep),
      While: While.actions.bind(While)
    };
    return actions[typeAction];
  }
export default GetAction