import "server-only";
import { z } from "zod";

const text = (max: number) => z.string().trim().min(1).max(max);
export const doctorInput = z.object({
  id: text(128), name: text(80), specialty: text(80), qualifications: text(150),
  experience: z.number().int().min(0).max(70), clinic: text(120), city: text(60),
  fee: z.number().min(0).max(100000), about: text(1000),
  symptoms: z.array(text(60)).max(20), color: z.enum(["blue","peach","lilac","mint","rose"]),
}).strict();
export const patientInput = z.object({
  id: text(128), name: text(80).min(2), email: z.email().max(254),
  phone: z.string().trim().max(30), city: text(60),
}).strict();
export const articleInput = z.object({
  id: text(128), title: text(120), category: text(80), summary: text(3000),
  symptoms: text(2000), source: z.url().max(1500).refine(s => new URL(s).protocol === "https:"),
  published: z.boolean(), edited: z.boolean(),
}).strict();
export const commandInput = z.discriminatedUnion("type", [
  z.object({type:z.literal("profile"), patient:patientInput}).strict(),
  z.object({type:z.literal("doctor"), doctor:doctorInput}).strict(),
  z.object({type:z.literal("article"), article:articleInput}).strict(),
  z.object({type:z.literal("slot-add"), date:z.iso.date(), time:z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)}).strict(),
  z.object({type:z.literal("slot-remove"), id:z.uuid()}).strict(),
  z.object({type:z.literal("book"), doctorId:text(128), slotId:z.uuid()}).strict(),
  z.object({type:z.literal("appointment"), id:z.uuid(), status:z.enum(["Confirmed","Declined","Completed"])}).strict(),
]);
