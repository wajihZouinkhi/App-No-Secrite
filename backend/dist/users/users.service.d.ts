import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
export declare class UsersService {
    private readonly userModel;
    constructor(userModel: Model<User>);
    private sanitizeInput;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    updateProfile(userId: string, updateData: {
        name: string;
        email: string;
    }): Promise<User>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
}
