import { randomUUID } from 'node:crypto';

export type DocumentDto = {
  url: string;
  origin: string;
  type: string;
  issuer: string;
  taxValue: number;
  netValue: number;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Document {
  id: string;
  url: string;
  origin: string;
  type: string;
  issuer: string;
  taxValue: number;
  netValue: number;
  createdAt: Date;
  updatedAt: Date;

  constructor({
    id,
    url,
    origin,
    type,
    issuer,
    taxValue,
    netValue,
    createdAt,
    updatedAt,
  }: DocumentDto & { id?: string }) {
    this.id = id || randomUUID();
    this.url = url;
    this.origin = origin;
    this.type = type;
    this.issuer = issuer;
    this.taxValue = taxValue;
    this.netValue = netValue;
    const now = new Date();
    this.createdAt = createdAt || now;
    this.updatedAt = updatedAt || now;
  }
}
