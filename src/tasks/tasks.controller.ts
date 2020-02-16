import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {TasksService} from "./tasks.service";
import {Tasks, TaskStatus} from "./task.model";
import {CreateTaskDto} from "./dto/create-task.dto";
import {GetTaskFilterDto} from "./dto/get-task-filter.dto";

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getAllTasks(@Query() filterDto: GetTaskFilterDto): Tasks[] {
        if(Object.keys(filterDto).length > 0) {
            return this.tasksService.getAllTasksWithFilter(filterDto);
        }
        return this.tasksService.getAllTasks();
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Tasks {
        return this.tasksService.createTasks(createTaskDto);
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string) {
        return this.tasksService.getTaskById(id);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string) {
        return this.tasksService.deleteTaskById(id);
    }

    @Patch('/:id/status')
    updateTask(@Param('id') id: string , @Body('status') status: TaskStatus) {
        return this.tasksService.updateTaskById(id, status);
    }
}
