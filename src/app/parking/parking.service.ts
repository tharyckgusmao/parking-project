import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../company/entity/company.entity';
import { vehicleEnum } from '../vehicle/dto/create.dto';
import { VehicleEntity } from '../vehicle/entity/vehicle.entity';
import { ParkingEntity } from './entity/parking.entity';

type payloadInput = {
  companyId: string;
  vehicleId: string;
};
enum parkingEvent {
  INPUT = 1,
  OUTPUT = 0,
}

@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(ParkingEntity)
    private readonly parkingRepository: Repository<ParkingEntity>,
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  private async changeVehicleOnParking(
    { companyId, vehicleId }: payloadInput,
    event: parkingEvent,
  ) {
    try {
      const vehicle = await this.vehicleRepository.findOneByOrFail({
        id: vehicleId,
      });

      const company = await this.companyRepository.findOneByOrFail({
        id: companyId,
      });

      let vacancyAvailable = false;
      //Diff entradas e saidas
      const vacanciesEventOutput = await this.parkingRepository.countBy({
        event: 0,
        company_id: companyId,
        vehicle: {
          type: vehicle.type,
        },
      });
      const vacanciesEventInput = await this.parkingRepository.countBy({
        event: 1,
        company_id: companyId,
        vehicle: {
          type: vehicle.type,
        },
      });
      const vacanciesOccupied = vacanciesEventInput - vacanciesEventOutput;

      //Ultimo status do veiculo no estacionamento
      const existEventForVehicle = await this.parkingRepository.findOne({
        where: { vehicle_id: vehicleId },
        order: { createdAt: 'DESC' },
      });

      //Validação do evento de entrada
      if (event == parkingEvent.INPUT) {
        if (existEventForVehicle?.event == parkingEvent.INPUT)
          throw new NotFoundException('Vehicle on parking');

        if (vehicle.type === vehicleEnum.CAR) {
          //Validar vagas disponiveis baseadas nas entradas e no estabelecimento
          if (vacanciesOccupied < company.qtyVacancyCars) {
            vacancyAvailable = true;
          }
        } else if (vehicle.type === vehicleEnum.MOTORBIKE) {
          if (vacanciesOccupied < company.qtyVacancyMotors) {
            vacancyAvailable = true;
          }
        }
        if (vacancyAvailable == false) {
          throw new NotFoundException('Not vacancy disponible');
        }
      } else {
        if (existEventForVehicle?.event != parkingEvent.INPUT)
          throw new NotFoundException('Not vehicle on parking');
      }

      await this.parkingRepository.save(
        this.parkingRepository.create({
          company_id: companyId,
          vehicle_id: vehicleId,
          event: event,
        }),
      );
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async input(params: payloadInput) {
    return await this.changeVehicleOnParking(params, parkingEvent.INPUT);
  }
  async output(params: payloadInput) {
    return await this.changeVehicleOnParking(params, parkingEvent.OUTPUT);
  }
}
