import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DbModule } from "./db/db.module";
import { AuthModule } from "./auth/auth.module";
import { RestaurantModule } from "./restaurant/restaurant.module";
import { MenuModule } from "./menu/menu.module";
import { OrderModule } from "./order/order.module";
import { ReservationModule } from "./reservation/reservation.module";
import { ComplaintModule } from "./complaint/complaint.module";
import { AdminModule } from "./admin/admin.module";
import { CustomerModule } from "./customer/customer.module";
import { AuthGuard } from "./common/guards/auth.guard";
import { RoleGuard } from "./common/guards/role.guard";
import { APP_GUARD } from "@nestjs/core";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DbModule,
        AuthModule,
        RestaurantModule,
        MenuModule,
        OrderModule,
        ReservationModule,
        ComplaintModule,
        AdminModule,
        CustomerModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RoleGuard,
        },
    ],
})

export class AppModule { }