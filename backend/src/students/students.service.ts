import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly repo: Repository<Student>,
  ) {}

  async create(dto: CreateStudentDto) {
    try {
      const student = this.repo.create(dto);
      return await this.repo.save(student);
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async search(
    search?: string,
    cgpaMin?: string,
    page = 1,
    limit = 8,
  ) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const qb = this.repo.createQueryBuilder('student');

    if (search?.trim()) {
      qb.andWhere(
        '(LOWER(student.name) LIKE LOWER(:s) OR LOWER(student.email) LIKE LOWER(:s) OR LOWER(student.department) LIKE LOWER(:s))',
        { s: `%${search.trim()}%` },
      );
    }

    if (cgpaMin !== undefined && cgpaMin !== '') {
      qb.andWhere('student.cgpa >= :c', {
        c: Number(cgpaMin),
      });
    }

    const [data, total] = await qb
      .orderBy('student.id', 'ASC')
      .skip(skip)
      .take(safeLimit)
      .getManyAndCount();

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
  }
}
