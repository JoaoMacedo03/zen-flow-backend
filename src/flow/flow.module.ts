import { Module } from '@nestjs/common';
import { FlowService } from './flow.service';
import { HttpActionService } from 'src/actions/http/http.service';
import { FlowController } from './flow.controller';
import { HttpModule } from '@nestjs/axios';
import { WhileActionService } from 'src/actions/While/while.service';
import { AwaitActionService } from 'src/actions/Await/await.service';
import { ConditionForNextStepService } from 'src/actions/ConditionForNextStep/ConditionForNextStep.service';

@Module({
  imports: [HttpModule],
  controllers: [FlowController],
  providers: [
    FlowService,
    WhileActionService,
    AwaitActionService,
    HttpActionService,
    ConditionForNextStepService,
  ],
})
export class FlowModule {}
