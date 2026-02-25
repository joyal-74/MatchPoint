
import { ClientSession } from "mongoose";
import { RegistrationModel } from "../../databases/mongo/models/RegistrationModel";
import { IRegistrationRepository } from "../../../app/repositories/interfaces/manager/IRegistrationRepository";
import { TournamentTeamMongoMapper } from "../../utils/mappers/TournamentTeamMongoMapper";
import { NotFoundError } from "../../../domain/errors/index";
import { PaymentStatus, Registration } from "../../../domain/entities/Registration";
import { TrafficPoint } from "../../../domain/dtos/Analytics.dto";
import { TournamentTeamData } from "../../../domain/dtos/Tournament";

export class RegistrationRepository implements IRegistrationRepository {
    async create(registration: Omit<Registration, '_id' | 'createdAt' | 'updatedAt'>, ctx?: unknown): Promise<Registration> {
        const session = ctx as ClientSession | undefined;

        const [createdDoc] = await RegistrationModel.create(
            [registration],
            { session }
        );

        return new Registration(
            createdDoc._id.toString(),
            createdDoc.tournamentId.toString(),
            createdDoc.type,
            createdDoc.teamId.toString(),
            createdDoc.captainId.toString(),
            createdDoc.managerId.toString(),
            createdDoc.paymentStatus,
            createdDoc.paymentId,
            createdDoc.createdAt,
            createdDoc.updatedAt
        );
    }

    async findByTournamentAndTeam(tournamentId: string, teamId: string): Promise<Registration | null> {
        return await RegistrationModel.findOne({ tournamentId, teamId });
    }

    async getTeamsByTournament(tournamentId: string): Promise<TournamentTeamData[]> {
        const teams = await RegistrationModel.find({ tournamentId })
            .populate("teamId")
            .populate("captainId")
            .lean();

        return TournamentTeamMongoMapper.toDomainArray(teams);
    }

    async updatePaymentStatus(registrationId: string, paymentStatus: 'completed' | 'failed', paymentId: string): Promise<Registration> {
        const doc = await RegistrationModel.findByIdAndUpdate(
            registrationId,
            { paymentStatus, paymentId, updatedAt: new Date() },
            { new: true }
        );
        if (!doc) throw new NotFoundError('Registration not found');
        return new Registration(
            doc._id.toString(),
            doc.tournamentId.toString(),
            doc.type,
            doc.teamId.toString(),
            doc.captainId.toString(),
            doc.managerId.toString(),
            doc.paymentStatus,
            doc.paymentId,
            doc.createdAt,
            doc.updatedAt
        );
    }

    async findByPaymentId(paymentId: string): Promise<Registration | null> {
        return await RegistrationModel.findOne({ paymentId });
    }

    async findManyByIds(ids: string[], page: number, limit: number): Promise<{ tournaments: TournamentTeamData[]; total: number; }> {
        const skip = (page - 1) * limit;

        const [tournaments, total] = await Promise.all([RegistrationModel.find({ _id: { $in: ids } })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        RegistrationModel.countDocuments({ _id: { $in: ids } })
        ]);

        const data = TournamentTeamMongoMapper.toDomainArray(tournaments);


        return { tournaments: data, total };
    }

    async findByTeamIds(teamIds: string[]): Promise<Registration[] | null> {
        const docs = await RegistrationModel.find({ teamId: { $in: teamIds } }).lean();

        if (!docs || docs.length === 0) {
            return null;
        }

        return docs.map(doc => new Registration(
            doc._id.toString(),
            doc.tournamentId.toString(),
            doc.type,
            doc.teamId.toString(),
            doc.captainId.toString(),
            doc.managerId.toString(),
            doc.paymentStatus,
            doc.paymentId,
            doc.createdAt,
            doc.updatedAt
        ));
    }


    async findTeamIdsByTournament(tournamentId: string): Promise<string[]> {
        const ids = await RegistrationModel
            .find({ tournamentId })
            .distinct("teamId");

        return ids.map(id => id.toString());
    }

    // Inside RegistrationRepository.ts
    async getPaidRegistrationsByTournament(tournamentId: string): Promise<Registration[]> {
        const docs = await RegistrationModel.find({
            tournamentId: tournamentId,
            paymentStatus: 'completed'
        }).populate('teamId', 'name').exec();

        return docs.map(doc => {
            const populatedTeam = doc.teamId as any;
            const actualId = populatedTeam?._id ? populatedTeam._id.toString() : doc.teamId.toString();

            const reg = new Registration(
                doc._id.toString(),
                doc.tournamentId.toString(),
                doc.type,
                actualId,
                doc.captainId.toString(),
                doc.managerId.toString(),
                doc.paymentStatus as PaymentStatus,
                doc.paymentId || null,
                doc._id.getTimestamp(),
                doc.updatedAt
            );

            // Attach the name temporarily so the Use Case can see it
            (reg as any).teamName = populatedTeam?.name || "Unknown Team"; 
            return reg;
        });
    }

    async getDailyRegistrations(tournamentIds: string[], days: number): Promise<TrafficPoint[]> {

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);


        return RegistrationModel.aggregate([
            {
                $match: {
                    tournamentId: { $in: tournamentIds },
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$createdAt" },
                    teams: { $count: {} }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
    }
}
