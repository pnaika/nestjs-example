import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateTaskDto} from "./dto/create-task.dto";
import {TaskRepository} from "./task.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {Task} from "./task.entity";
import {TaskStatus} from "./task-status.enum";
import {DeleteResult, UpdateResult} from "typeorm";
import {GetTaskFilterDto} from "./dto/get-task-filter.dto";

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository) {
    }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`${id} Not Found`);
        }

        return found;
    }

    createTasks(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTasks(createTaskDto);
    }

    async deleteTaskById(id: number) : Promise<DeleteResult> {
        let found: DeleteResult = await this.taskRepository.delete(id);

        if (found.affected === 0) {
            throw new NotFoundException(`${id} Not Found`);
        }

        return found;
    }

    async updateTaskById(id: number, status: TaskStatus): Promise<UpdateResult> {
        return await this.taskRepository.update(id, {status});
    }

    async getAllTasks (filterDto: GetTaskFilterDto): Promise<Task[]> {
        return await this.taskRepository.getTasks(filterDto);
    }

    // getAllTasksWithFilter(filterDto: GetTaskFilterDto): Tasks[] {
    //     const { status, search } = filterDto;
    //
    //     let tasks = this.getAllTasks();
    //
    //     if (status) {
    //         tasks = tasks.filter( task => task.status === status);
    //     }
    //
    //     if (search) {
    //         tasks = tasks.filter( task => {
    //             task.title.includes(search) ||
    //             task.description.includes(search)
    //         });
    //     }
    //     return tasks;
    // }
    //
    // getAllTasks(): Tasks[] {
    //     return this.tasks;
    // }
    //

}
