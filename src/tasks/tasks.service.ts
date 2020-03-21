import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateTaskDto} from "./dto/create-task.dto";
import {TaskRepository} from "./task.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {Task} from "./task.entity";
import {TaskStatus} from "./task-status.enum";
import {DeleteResult, UpdateResult} from "typeorm";
import {GetTaskFilterDto} from "./dto/get-task-filter.dto";
import { User } from "../auth/user.entity";

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository) {
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({where: {id, userId: user.id}});

        if (!found) {
            throw new NotFoundException(`${id} Not Found`);
        }

        return found;
    }

    createTasks(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTasks(createTaskDto, user);
    }

    async deleteTaskById(id: number, user: User) : Promise<DeleteResult> {
        let found: DeleteResult = await this.taskRepository.delete({id, userId: user.id});

        if (found.affected === 0) {
            throw new NotFoundException(`${id} Not Found`);
        }

        return found;
    }

    async updateTaskById(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);

        task.status = status;
        await task.save();
        return task;

    }

    async getAllTasks (filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        return await this.taskRepository.getTasks(filterDto, user);
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
