import {ArgumentMetadata, BadRequestException, PipeTransform} from "@nestjs/common";
import {TaskStatus} from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform{
    readonly  allowedTaskStatus = [
        TaskStatus.DONE,
        TaskStatus.IN_PROGRESS,
        TaskStatus.OPEN
    ];

    transform(value: any, metadata: ArgumentMetadata): any {
        value = value.toUpperCase();
        if(!this.isValidStatus(value)) {
            throw new BadRequestException(`${value} is a invalid status`);
        }
        return value;
    }

    private isValidStatus(status) {
        const index = this.allowedTaskStatus.indexOf(status);

        return index !== -1;
    }
}