import { IDashboardRepository, DashboardData } from '../../domain/repositories/dashboard.repository';

export class GetDashboardSummaryUseCase {
  constructor(private readonly dashboardRepository: IDashboardRepository) {}

  async execute(): Promise<DashboardData> {
    return this.dashboardRepository.getDashboardData();
  }
}

