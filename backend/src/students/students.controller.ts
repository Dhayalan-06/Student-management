import {
  Body,
  Controller,
  Get,
  Put,
  Param,
  Delete,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AdminGuard } from './admin.guard';
import { CreateStudentDto } from './dto/create-student.dto';
import { SearchStudentsDto } from './dto/search-students.dto';
import { StudentsService } from './students.service';

@Controller('api/students')
export class StudentsController {
  constructor(private readonly service: StudentsService) {}

  // GET - Search, Filter, Pagination
  @Get()
  findAll(@Query() query: SearchStudentsDto) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 20;

    return this.service.search(
      query.search,
      query.cgpa_min,
      page,
      limit,
    );
  }

  // POST - Create Student
  @Post()
  @UseGuards(AdminGuard)
  create(@Body() dto: CreateStudentDto) {
    return this.service.create(dto);
  }

  // PUT - Edit Student
  @Put(':id')
  @UseGuards(AdminGuard)
  update(
    @Param('id') id: string,
    @Body() dto: CreateStudentDto,
  ) {
    return this.service.update(Number(id), dto);
  }

  // DELETE - Delete Student
  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}