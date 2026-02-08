"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UserLocationEntity_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLocationEntity = void 0;
const location_entity_1 = require("../../models/location/location.entity");
const users_entity_1 = require("../../models/users/users.entity");
const typeorm_1 = require("typeorm");
let UserLocationEntity = UserLocationEntity_1 = class UserLocationEntity extends typeorm_1.BaseEntity {
    static async getLocationByUserId(userId) {
        const userLocation = await this.getRepository()
            .createQueryBuilder("user_location")
            .innerJoin("user_location.location", "location")
            .select([
            "location.state AS state",
            "location.country AS country",
            "location.city AS city",
            "location.latitude AS latitude",
            "location.longitude AS longitude",
            "user_location.user_id AS userId",
        ])
            .where("user_location.user_id = :userId", { userId })
            .getRawOne();
        return userLocation;
    }
    static async updateUserLocation(userId, locationId) {
        return this.getRepository()
            .createQueryBuilder()
            .update(UserLocationEntity_1)
            .set({ locationId })
            .where("user_id = :userId", { userId })
            .returning("*")
            .execute();
    }
    static async getCooksNearby(latitude, longitude) {
        const cooks = await this.getRepository()
            .createQueryBuilder("user_location")
            .innerJoin(location_entity_1.LocationEntity, "location")
            .innerJoin(users_entity_1.UserEntity, "user", "user.id = user_location.user_id")
            .innerJoin("meal", "meal", "meal.user_id = user.id")
            .select([
            "user.id AS id",
            "user.full_name AS cook_fullName",
            "location.city AS city",
            "location.state AS state",
            "location.country AS country",
            "meal.id AS mealId",
            "meal.name AS mealName",
            "meal.description AS mealDescription",
            "meal.price AS mealPrice",
        ])
            .where(`ST_DistanceSphere(
          ST_MakePoint(location.longitude, location.latitude),
          ST_MakePoint(:longitude, :latitude)
        ) <= :radius`, { latitude, longitude, radius: 5000 })
            .andWhere("user.role = 'COOK'")
            .getRawMany();
        return cooks;
    }
};
exports.UserLocationEntity = UserLocationEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
], UserLocationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "user_id", type: "uuid" })
], UserLocationEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "location_id", type: "uuid" })
], UserLocationEntity.prototype, "locationId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => location_entity_1.LocationEntity, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: "location_id", referencedColumnName: "id" })
], UserLocationEntity.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp with time zone" })
], UserLocationEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at", type: "timestamp with time zone" })
], UserLocationEntity.prototype, "updatedAt", void 0);
exports.UserLocationEntity = UserLocationEntity = UserLocationEntity_1 = __decorate([
    (0, typeorm_1.Entity)({ name: "user_locations" })
], UserLocationEntity);
//# sourceMappingURL=user_location.entity.js.map