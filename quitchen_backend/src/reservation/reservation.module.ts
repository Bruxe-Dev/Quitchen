import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { RestaurantModule } from '../restaurant/restaurant.module';

@Module({
    imports: [RestaurantModule],
    controllers: [ReservationController],
    providers: [ReservationService],
    exports: [ReservationService],
})
export class ReservationModule { }
