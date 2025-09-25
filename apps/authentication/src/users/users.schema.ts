import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;
}

export type UserDocument = HydratedDocument<User>;
export type UserLeanDocument = {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
};

export const UserSchema = SchemaFactory.createForClass(User);
