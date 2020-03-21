import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query, UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {TasksService} from "./tasks.service";
import {CreateTaskDto} from "./dto/create-task.dto";
import {GetTaskFilterDto} from "./dto/get-task-filter.dto";
import {TaskStatusValidationPipe} from "./pipes/task-status-validation.pipe";
import {Task} from "./task.entity";
import {TaskStatus} from "./task-status.enum";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "../auth/get-user.decorator";
import { User } from "../auth/user.entity";

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) : Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
      @Body() createTaskDto: CreateTaskDto,
      @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.createTasks(createTaskDto, user);
    }
    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number,
               @GetUser() user: User) {
        return this.tasksService.deleteTaskById(id, user);
    }

    @Patch('/:id/status')
    updateTask(@Param('id', ParseIntPipe) id: number,
               @Body('status', TaskStatusValidationPipe) status: TaskStatus,
               @GetUser() user: User) {
        return this.tasksService.updateTaskById(id, status, user);
    }

    @Get()
    getAllTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto,  @GetUser() user: User): Promise<Task[]> {
        return this.tasksService.getAllTasks(filterDto, user);
    }

}
