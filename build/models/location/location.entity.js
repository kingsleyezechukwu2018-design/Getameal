"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationEntity = void 0;
const typeorm_1 = require("typeorm");
let LocationEntity = class LocationEntity extends typeorm_1.BaseEntity {
    static async getLocationsGroupedByState() {
        const locations = await this.getRepository()
            .createQueryBuilder("location")
            .select("location.state", "state")
            .addSelect(`json_agg(json_build_object('city', location.city, 'latitude', location.latitude, 'longitude', location.longitude))`, "places")
            .groupBy("location.state")
            .getRawMany();
        //sample response: [
        //   {
        //     state: "California",
        //     places: [
        //       { city: "Los Angeles", latitude: 34.0522, longitude: -118.2437 },
        //       { city: "San Francisco", latitude: 37.7749, longitude: -122.4194 },
        //     ],
        //   },
        // ];
        return locations.map((loc) => ({
            state: loc.state,
            places: loc.places, // Each place: { city, latitude, longitude }
        }));
    }
    static async findByCoordinates(latitude, longitude) {
        return this.findOne({
            where: {
                latitude,
                longitude,
            },
        });
    }
    static async createLocation(params) {
        return this.getRepository().save(params);
    }
};
exports.LocationEntity = LocationEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
], LocationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "latitude", type: "decimal", nullable: false })
], LocationEntity.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "longitude", type: "decimal", nullable: false })
], LocationEntity.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "country", type: "varchar", length: 100 })
], LocationEntity.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "state", type: "varchar", length: 255 })
], LocationEntity.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "city", type: "varchar", length: 255 })
], LocationEntity.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp with time zone" })
], LocationEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at", type: "timestamp with time zone" })
], LocationEntity.prototype, "updatedAt", void 0);
exports.LocationEntity = LocationEntity = __decorate([
    (0, typeorm_1.Index)(["latitude", "longitude"], { unique: true }),
    (0, typeorm_1.Entity)({ name: "locations" })
], LocationEntity);
//# sourceMappingURL=location.entity.js.map