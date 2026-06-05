import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { RestaurantModule } from '../restaurant/restaurant.module';

@Module({
    imports: [RestaurantModule],
    controllers: [MenuController],
    providers: [MenuService],
    exports: [MenuService],
})
export class MenuModule { }
