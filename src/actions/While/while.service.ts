import { Injectable } from '@nestjs/common';
import { GetObject } from 'src/utils/GetObject';

@Injectable()
export class WhileActionService {
  async action({ iterator, nameItem, flow }, exec, dataSet): Promise<any> {
    const Iterator = GetObject(dataSet, iterator);
    for (const item of Iterator) {
      await exec({
        newDataSet: dataSet,
        data: item,
        nameData: nameItem,
        flow,
      });
    }
  }
}
