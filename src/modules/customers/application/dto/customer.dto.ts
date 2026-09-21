import { Customer, CustomerGrade, CustomerSortOption } from '../../domain/entities/customer';

export interface GetCustomersRequestDto {
  searchQuery?: string;
  gradeFilter?: CustomerGrade | 'ALL';
  sortBy?: CustomerSortOption;
  page?: number;
  pageSize?: number;
}

export interface GetCustomersResponseDto {
  customers: Customer[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

