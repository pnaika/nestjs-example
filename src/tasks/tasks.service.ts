import {Injectable} from '@nestjs/common';
import {Tasks, TaskStatus} from "./task.model";
import * as uuid from 'uuid/v1';
import {CreateTaskDto} from "./dto/create-task.dto";
import {GetTaskFilterDto} from "./dto/get-task-filter.dto";

@Injectable()
export class TasksService {
    private tasks: Tasks[] = [];


    getAllTasksWithFilter(filterDto: GetTaskFilterDto): Tasks[] {
        const { status, search } = filterDto;

        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter( task => task.status === status);
        }

        if (search) {
            tasks = tasks.filter( task => {
                task.title.includes(search) ||
                task.description.includes(search)
            });
        }
        return tasks;
    }

    getAllTasks(): Tasks[] {
        return this.tasks;
    }

    createTasks(createTaskDto: CreateTaskDto) {
        const { title, description } = createTaskDto;

        const task: Tasks = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.DONE
        };

        this.tasks.push(task);
        return task;
    }

    getTaskById(id: string) : Tasks {
        return this.tasks.find(task => task.id === id);
    }

    deleteTaskById(id: string) : void {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    updateTaskById(id: string, status: TaskStatus) : Tasks {
        const task = this.getTaskById(id);

        task.status = status;
        return task;
    }
}
