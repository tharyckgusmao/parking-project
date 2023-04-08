import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CompanyEntity } from '../company/entity/company.entity';
import { ParkingEntity } from '../parking/entity/parking.entity';
import { vehicleEnum } from '../vehicle/dto/create.dto';
import { VehicleEntity } from '../vehicle/entity/vehicle.entity';
import { FilterDto } from './dto/filter.dto';
type payloadInput = {
  companyId: string;
  vehicleId?: string;
};
export class ReportsService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(ParkingEntity)
    private readonly parkingRepository: Repository<ParkingEntity>,
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  private async getCompanyAndBusyParking(companyId: string) {
    const company = await this.companyRepository.findOneByOrFail({
      id: companyId,
    });

    const vacanciesCarOutput = await this.parkingRepository.countBy({
      event: 0,
      company_id: companyId,
      vehicle: {
        type: vehicleEnum.CAR,
      },
    });
    const vacanciesCarInput = await this.parkingRepository.countBy({
      event: 0,
      company_id: companyId,
      vehicle: {
        type: vehicleEnum.CAR,
      },
    });
    const vacanciesOccupiedCar = vacanciesCarOutput - vacanciesCarInput;
    const vacanciesMotoOutput = await this.parkingRepository.countBy({
      event: 0,
      company_id: companyId,
      vehicle: {
        type: vehicleEnum.MOTORBIKE,
      },
    });
    const vacanciesMotoInput = await this.parkingRepository.countBy({
      event: 0,
      company_id: companyId,
      vehicle: {
        type: vehicleEnum.MOTORBIKE,
      },
    });
    const vacanciesOccupiedMoto = vacanciesMotoOutput - vacanciesMotoInput;

    const occupied = {
      [vehicleEnum.CAR]: vacanciesOccupiedCar,
      [vehicleEnum.MOTORBIKE]: vacanciesOccupiedMoto,
    };

    return {
      total: {
        occupied,
        available: {
          [vehicleEnum.CAR]: company.qtyVacancyCars,
          [vehicleEnum.MOTORBIKE]: company.qtyVacancyMotors,
        },
      },
      company,
    };
  }

  async getGroupingTotal(
    { companyId, vehicleId }: payloadInput,
    filter: FilterDto,
  ) {
    const query = `
        WITH cte as (
            SELECT 
            event,
                vehicle_id,
            created_at as date_diff, ROW_NUMBER() OVER ( ORDER BY created_at) as rownum,
            DAY(p.created_at) as day_group
            FROM parking as p
            WHERE  p.created_at >=  (NOW() - INTERVAL ${
              filter?.range || '7 DAY'
            }) AND
            p.vehicle_id = "${vehicleId}"
            	ORDER BY p.created_at DESC 
            )
        SELECT 
        d.day_group,
        d.vehicle_id,
        sum(d.parked_time) as parked_time
        FROM 	(
            SELECT cte1.day_group as day_group,
                    cte1.vehicle_id,
            SUM(UNIX_TIMESTAMP(cte2.date_diff) -  UNIX_TIMESTAMP(cte1.date_diff))  as parked_time
            
                FROM cte as cte1
              INNER JOIN cte cte2 ON cte1.rownum = cte2.rownum - 1
              AND cte1.vehicle_id = cte2.vehicle_id
              AND cte1.event = 0 AND cte2.event = 1
        
        ) as d
        GROUP BY d.day_group
        ORDER BY d.day_group ASC;
        ;
			
`;

    const vehicle = await this.dataSource.query(query);
    const info = await this.getCompanyAndBusyParking(companyId);

    return {
      info,
      data: vehicle,
    };
  }

  async getListRange({ companyId }: payloadInput, filter: FilterDto) {
    const query = `
        WITH cte as (
            SELECT 
            event,
            vehicle_id,
            created_at as date_diff, ROW_NUMBER() OVER ( ORDER BY created_at) as rownum,
            DAY(p.created_at) as day_group
            FROM parking as p
            WHERE  p.created_at >=  ${
              filter.startOfDate
                ? `DATE("${filter.startOfDate}")`
                : '(NOW() - INTERVAL 7 DAY)'
            }  AND p.created_at <= ${
      filter.endOfDate
        ? `DATE("${filter.endOfDate}")`
        : '(NOW() - INTERVAL 7 DAY)'
    } AND p.company_id = "${companyId}"
      ORDER BY p.created_at DESC 
            ),
        dates_group as (

            SELECT 
            d.day_group,
            d.vehicle_id,
            sum(d.parked_time) as parked_time
            FROM 	(
                SELECT cte1.day_group as day_group,
                        cte1.vehicle_id,
                SUM(UNIX_TIMESTAMP(cte2.date_diff) -  UNIX_TIMESTAMP(cte1.date_diff))  as parked_time
                
              FROM cte as cte1
              INNER JOIN cte cte2 ON cte1.rownum = cte2.rownum - 1
              AND cte1.vehicle_id = cte2.vehicle_id
              AND cte1.event = 0 AND cte2.event = 1
            ) as d
            GROUP BY d.day_group
            ORDER BY d.day_group ASC
          )
          select vehicle_id, avg(parked_time) as parked_time from dates_group GROUP BY vehicle_id


        ;
			
`;

    const vehicle = await this.dataSource.query(query);
    const info = await this.getCompanyAndBusyParking(companyId);

    return {
      info,
      data: vehicle,
    };
  }

  async getListEvents({ companyId, vehicleId }: payloadInput) {
    const vehicle = await this.parkingRepository.find({
      where: {
        vehicle_id: vehicleId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    const info = await this.getCompanyAndBusyParking(companyId);

    return {
      info,
      data: vehicle,
    };
  }
}
