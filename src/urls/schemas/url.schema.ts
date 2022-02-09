import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UrlDocument = Url & Document;
export type VisitCountDocument = Visit & Document;

@Schema({ _id: false })
export class Visit {
  @Prop({ required: true, index: true, unique: true })
  country: string;

  @Prop({ default: 0 })
  count: number;
}
export const VisitSchema = SchemaFactory.createForClass(Visit);

@Schema({ timestamps: true })
export class Url {
  @Prop({
    trim: true,
    lowercase: true,
    index: true,
    unique: true,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    unique: true,
    index: true,
    required: true,
  })
  id: string;

  @Prop({ default: 0 })
  totalClicks?: number;

  @Prop({ default: 'OTHERS' })
  encodeRequestCountry?: string;

  @Prop({ type: [VisitSchema], default: [] })
  visits?: Visit[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
